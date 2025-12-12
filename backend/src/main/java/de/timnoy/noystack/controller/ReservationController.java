package de.timnoy.noystack.controller;

import de.timnoy.noystack.controller.dto.ReservationDto;
import de.timnoy.noystack.controller.dto.ReservationResponseDto;
import de.timnoy.noystack.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequiredArgsConstructor
public class ReservationController implements ReservationApi {

    private final ReservationService reservationService;

    @Override
    public ResponseEntity<List<ReservationResponseDto>> getReservations(UUID userId, UUID carId, LocalDateTime startDate, LocalDateTime endDate) {
        List<ReservationResponseDto> reservations = reservationService.getReservations();
        return ResponseEntity.ok().body(reservations);
    }

    @Override
    public ResponseEntity<ReservationResponseDto> getReservationById(UUID reservationId) {
        ReservationResponseDto reservation = reservationService.getReservation(reservationId);
        return ResponseEntity.ok().body(reservation);
    }

    @Override
    public ResponseEntity<Void> postReservation(ReservationDto reservationDto) {
        UUID savedId = reservationService.createReservation(reservationDto);
        URI location = URI.create("/api/v1/reservation/" + savedId);
        return ResponseEntity.created(location).build();
    }

    @Override
    public ResponseEntity<ReservationResponseDto> putReservation(UUID reservationId, ReservationDto reservationDto) {
        ReservationResponseDto reservation = reservationService.updateReservation(reservationId, reservationDto);

        return ResponseEntity.ok().body(reservation);
    }

    @Override
    public ResponseEntity<Void> deleteReservation(UUID reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }
}
