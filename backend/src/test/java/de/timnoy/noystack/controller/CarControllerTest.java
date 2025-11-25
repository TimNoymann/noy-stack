package de.timnoy.noystack.controller;

import de.timnoy.noystack.controller.dto.CarDto;
import de.timnoy.noystack.controller.dto.CarResponseDto;
import de.timnoy.noystack.exception.CarNotFoundException;
import de.timnoy.noystack.service.CarService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CarController.class)
@AutoConfigureMockMvc(addFilters = false)
class CarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CarService carService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void whenGetCarInfo_thenReturnSuccessString() throws Exception {
        // given
        CarResponseDto carResponseDto = new CarResponseDto();
        when(carService.getCar(any(UUID.class))).thenReturn(carResponseDto);

        // when & then
        mockMvc.perform(
                        get("/api/v1/car/" + UUID.randomUUID())
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk());
    }

    @Test
    void whenGetCarInfo_thenReturnNotFound() throws Exception {
        // given
        when(carService.getCar(any(UUID.class))).thenThrow(new CarNotFoundException(UUID.randomUUID()));

        // when & then
        mockMvc.perform(
                        get("/api/v1/car/" + UUID.randomUUID())
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isNotFound());
    }

    @Test
    void whenPostCar_thenReturnSuccess() throws Exception {
        // given
        CarDto car = CarDto.builder().name("TestCar").build();
        UUID createdCarId = UUID.randomUUID();
        when(carService.addCar(any(CarDto.class))).thenReturn(createdCarId);

        // when & then
        mockMvc.perform(
                        post("/api/v1/car")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(car))
                )
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/v1/car/" + createdCarId));
    }

    @Test
    void whenDeleteCar_thenReturnSuccess() throws Exception {
        // given
        UUID carId = UUID.randomUUID();
        doNothing().when(carService).deleteCar(carId);

        // when & then
        mockMvc.perform(
                        delete("/api/v1/car/" + carId)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk());
    }

    @Test
    void whenPutCar_thenReturnSuccess() throws Exception {
        // given
        UUID carId = UUID.randomUUID();
        CarDto carDto = CarDto.builder().name("UpdatedCar").build();
        CarResponseDto updatedCarResponseDto = new CarResponseDto();
        when(carService.updateCar(eq(carId), any(CarDto.class))).thenReturn(updatedCarResponseDto);

        // when & then
        mockMvc.perform(
                        put("/api/v1/car/" + carId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(carDto))
                )
                .andExpect(status().isOk());
    }

    @Test
    void whenPutCarWithInvalidId_thenReturnBadRequest() throws Exception {
        // given
        String invalidCarId = "invalid-uuid";
        CarDto carDto = CarDto.builder().name("UpdatedCar").build();

        // when & then
        mockMvc.perform(
                        put("/api/v1/car/" + invalidCarId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(carDto))
                )
                .andExpect(status().isBadRequest());
    }

}