package de.timnoy.noystack.exception;

import java.util.UUID;

public class CarNotFoundException extends RuntimeException {
    public CarNotFoundException(UUID carId) {
        super("Car with id %s not found".formatted(carId));
    }
}
