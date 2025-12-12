package de.timnoy.noystack.controller;

import de.timnoy.noystack.controller.dto.CarDto;
import de.timnoy.noystack.controller.dto.CarResponseDto;
import de.timnoy.noystack.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
public class CarController implements CarApi {

    private final CarService carService;

    @Override
    public ResponseEntity<CarResponseDto> getCarById(UUID carId) {
        return ResponseEntity.ok(carService.getCar(carId));
    }

    @Override
    public ResponseEntity<List<CarResponseDto>> getCars() {
        return ResponseEntity.ok(carService.getCars());
    }

    @Override
    public ResponseEntity<Void> postCar(CarDto carDto) {
        System.out.println("postCar reached");
        UUID carId = carService.addCar(carDto);
        URI location = URI.create("/api/v1/car/" + carId);
        return ResponseEntity.created(location).build();
    }

    @Override
    public ResponseEntity<CarResponseDto> putCar(UUID carId, CarDto carDto) {
        return ResponseEntity.ok(carService.updateCar(carId, carDto));
    }

    @Override
    public ResponseEntity<Void> deleteCar(UUID carId) {
        carService.deleteCar(carId);
        return ResponseEntity.ok().build();
    }

}
