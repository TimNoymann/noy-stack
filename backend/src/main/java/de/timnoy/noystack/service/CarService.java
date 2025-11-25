package de.timnoy.noystack.service;

import de.timnoy.noystack.controller.dto.CarDto;
import de.timnoy.noystack.controller.dto.CarResponseDto;
import de.timnoy.noystack.exception.CarNotFoundException;
import de.timnoy.noystack.model.Car;
import de.timnoy.noystack.persistence.entity.CarEntity;
import de.timnoy.noystack.persistence.repository.CarRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepo carRepo;

    @Transactional(readOnly = true)
    public List<CarResponseDto> getCars() {
        List<Car> allCars = carRepo.findAllCars();

        return allCars.stream()
                .map(car -> {
                    CarResponseDto carDto = new CarResponseDto();
                    carDto.setId(car.getId());
                    carDto.setName(car.getName());
                    return carDto;
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public CarResponseDto getCar(final UUID carId) {
        Car car = carRepo.findCarById(carId).orElseThrow(
                () -> new CarNotFoundException(carId));

        CarResponseDto carDto = new CarResponseDto();
        carDto.setId(car.getId());
        carDto.setName(car.getName());
        return carDto;
    }

    @Transactional
    public UUID addCar(final CarDto car) {
        CarEntity carEntity = new CarEntity();
        carEntity.setId(UUID.randomUUID());
        carEntity.setName(car.getName());
        CarEntity savedCar = carRepo.save(carEntity);

        return savedCar.getId();
    }

    @Transactional
    public CarResponseDto updateCar(final UUID carId, final CarDto car) {
        CarEntity carEntity = carRepo.findById(carId).orElseThrow(() -> new CarNotFoundException(carId));
        carEntity.setName(car.getName());

        CarResponseDto carDto = new CarResponseDto();
        carDto.setId(carEntity.getId());
        carDto.setName(carEntity.getName());
        return carDto;
    }

    @Transactional
    public void deleteCar(UUID carId) {
        carRepo.deleteById(carId);
    }
}
