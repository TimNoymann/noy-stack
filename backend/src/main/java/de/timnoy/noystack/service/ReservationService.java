package de.timnoy.noystack.service;

import de.timnoy.noystack.controller.dto.ReservationDto;
import de.timnoy.noystack.controller.dto.ReservationResponseDto;
import de.timnoy.noystack.exception.CarNotFoundException;
import de.timnoy.noystack.exception.ReservationAlreadyExistsException;
import de.timnoy.noystack.exception.ReservationNotFoundException;
import de.timnoy.noystack.persistence.entity.CarEntity;
import de.timnoy.noystack.persistence.entity.ReservationEntity;
import de.timnoy.noystack.persistence.projection.ReservationProjection;
import de.timnoy.noystack.persistence.repository.CarRepo;
import de.timnoy.noystack.persistence.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final CarRepo carRepo;

    private final ReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public List<ReservationResponseDto> getReservations() {
        return reservationRepository.findAllAsProjection().stream().map(reservation ->
            ReservationResponseDto.builder()
                    .id(reservation.id())
                    .carId(reservation.carId())
                    .startTime(reservation.startTime())
                    .endTime(reservation.endTime())
                    .build()
        ).toList();
    }

    @Transactional(readOnly = true)
    public ReservationResponseDto getReservation(UUID reservationId) {
        ReservationProjection reservationProjection = reservationRepository.findAsProjection(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        return ReservationResponseDto.builder()
                .id(reservationProjection.id())
                .carId(reservationProjection.carId())
                .startTime(reservationProjection.startTime())
                .endTime(reservationProjection.endTime())
                .build();
    }

    @Transactional
    public UUID createReservation(ReservationDto createReservationDto) {
        CarEntity car = carRepo.findById(createReservationDto.getCarId())
                .orElseThrow(() -> new CarNotFoundException(createReservationDto.getCarId()));

        validateNoReservationOverlap(createReservationDto);

        ReservationEntity reservationEntity = ReservationEntity.builder()
                .car(car)
                .startTime(createReservationDto.getStartTime())
                .endTime(createReservationDto.getEndTime())
                .build();

        ReservationEntity savedReservation = reservationRepository.save(reservationEntity);
        return savedReservation.getId();
    }

    @Transactional
    public ReservationResponseDto updateReservation(UUID reservationId, ReservationDto updateReservationDto) {
        ReservationEntity reservationEntity = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        CarEntity carEntity = carRepo.findById(updateReservationDto.getCarId())
                        .orElseThrow(() -> new CarNotFoundException(updateReservationDto.getCarId()));

        validateNoReservationOverlap(updateReservationDto);

        reservationEntity.setStartTime(updateReservationDto.getStartTime());
        reservationEntity.setEndTime(updateReservationDto.getEndTime());
        reservationEntity.setCar(carEntity);
        reservationRepository.save(reservationEntity);

        return ReservationResponseDto.builder()
                .id(reservationEntity.getId())
                .carId(reservationEntity.getCar().getId())
                .startTime(reservationEntity.getStartTime())
                .endTime(reservationEntity.getEndTime())
                .build();

    }

    @Transactional
    public void deleteReservation(UUID reservationId) {
        ReservationEntity reservationEntity = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        reservationRepository.delete(reservationEntity);
    }

    private void validateNoReservationOverlap(ReservationDto createReservationDto) {
        boolean reservationExists = reservationRepository.existsByCarIdEqualsAndEndTimeBeforeAndStartTimeAfter(
                createReservationDto.getCarId(),
                createReservationDto.getStartTime(),
                createReservationDto.getEndTime()
        );

        if (reservationExists) {
            throw new ReservationAlreadyExistsException("Reservation already exists for the given car and time slot");
        }
    }
}
