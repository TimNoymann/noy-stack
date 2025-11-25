package de.timnoy.noystack.persistence.repository;

import de.timnoy.noystack.model.Car;
import de.timnoy.noystack.persistence.entity.CarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CarRepo extends JpaRepository<CarEntity, UUID> {

    @Query("SELECT new de.timnoy.noystack.model.Car(c.id, c.name) as name FROM CarEntity c WHERE c.id = :id")
    Optional<Car> findCarById(UUID id);

    @Query("SELECT new de.timnoy.noystack.model.Car(c.id, c.name) as name FROM CarEntity c")
    List<Car> findAllCars();
}
