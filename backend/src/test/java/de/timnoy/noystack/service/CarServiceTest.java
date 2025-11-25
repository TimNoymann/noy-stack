package de.timnoy.noystack.service;

import de.timnoy.noystack.controller.dto.CarDto;
import de.timnoy.noystack.persistence.entity.CarEntity;
import de.timnoy.noystack.persistence.repository.CarRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock
    CarRepo carRepo;

    @InjectMocks
    CarService carService;

    @Captor
    ArgumentCaptor<CarEntity> carEntityCaptor;

    @Test
    void whenAddCar_thenRepoSaveIsCalledSuccessfully() {
        // given
        CarDto car = CarDto.builder()
                .name("carName")
                .build();

        CarEntity carEntity = new CarEntity();
        carEntity.setId(UUID.randomUUID());
        carEntity.setName(car.getName());

        when(carRepo.save(any())).thenReturn(carEntity);

        // when
        UUID resultId = carService.addCar(car);

        // then
        assertEquals(carEntity.getId(), resultId);

        verify(carRepo, times(1)).save(carEntityCaptor.capture());
        CarEntity capturedCarEntity = carEntityCaptor.getValue();
        assertEquals("carName", capturedCarEntity.getName());
        assertNotEquals("external-id-that-will-be-ignored", capturedCarEntity.getId());
    }

    @Test
    void whenUpdateCar_thenUpdatedSuccessfully() {
        // given
        CarEntity carEntity = CarEntity.builder()
                .id(UUID.randomUUID())
                .name("oldName")
                .build();
        when(carRepo.findById(any())).thenReturn(java.util.Optional.of(carEntity));

        CarDto carToUpdate = CarDto.builder()
                .name("newName")
                .build();

        // when
        carService.updateCar(carEntity.getId(), carToUpdate);

        // then
        assertEquals("newName", carEntity.getName());
    }

    @Test
    void whenDeleteCar_thenRepoDeleteByIdIsCalled() {
        // given
        UUID carId = UUID.randomUUID();

        // when
        carService.deleteCar(carId);

        // then
        verify(carRepo, times(1)).deleteById(carId);
    }
}