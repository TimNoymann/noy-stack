package de.timnoy.noystack.it;

import de.timnoy.noystack.controller.dto.CarDto;
import de.timnoy.noystack.persistence.entity.CarEntity;
import de.timnoy.noystack.persistence.repository.CarRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CarControllerIT extends AbstractIT {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    CarRepo carRepo;

    UUID createdCarId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        carRepo.deleteAll();
        CarEntity carEntity = CarEntity.builder()
                .id(createdCarId)
                .name("someName")
                .build();
        carRepo.save(carEntity);
    }

    @Test
    void whenGetCars_thenReturnPersistedCards() throws Exception {
        mockMvc.perform(get("/api/v1/car"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(isA(String.class)))
                .andExpect(jsonPath("$[0].name").value("someName"));
    }

    @Test
    void whenGetCar_thenReturnPersistedCar() throws Exception {
        mockMvc.perform(get("/api/v1/car/" + createdCarId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdCarId.toString()))
        .andExpect(jsonPath("$.name").value("someName"));

    }

    @Test
    void whenPostCar_thenItIsPersistedAndReturnedByGetCars() throws Exception {
        // given
        CarDto car = CarDto.builder()
                .name("HTTP Car")
                .build();

        // when
        MvcResult postResult = mockMvc.perform(post("/api/v1/car")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(car)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andReturn();

        String location = postResult.getResponse().getHeader("Location");

        // then
        mockMvc.perform(MockMvcRequestBuilders.get(location))
                .andExpect(status().isOk());
    }

    @Test
    void whenGetCarThatDoesNotExist_thenNotFoundIsReturned() throws Exception {
        // given
        UUID nonExistingId = UUID.randomUUID();

        // when & then
        mockMvc.perform(get("/api/v1/car/" + nonExistingId))
                .andExpect(jsonPath("$.title").value("Not Found"))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value(containsString(nonExistingId.toString())));
    }

    @Test
    void whenDeleteCar_thenItIsRemoved() throws Exception {
        // when
        UUID carId = UUID.randomUUID();
        mockMvc.perform(delete("/api/v1/car/" + carId))
                .andExpect(status().isOk());

        // then
        assertThat(carRepo.findById(carId)).isEmpty();
    }
}
