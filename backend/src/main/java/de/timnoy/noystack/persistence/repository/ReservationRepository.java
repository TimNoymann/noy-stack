package de.timnoy.noystack.persistence.repository;

import de.timnoy.noystack.persistence.entity.ReservationEntity;
import de.timnoy.noystack.persistence.projection.ReservationProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<ReservationEntity, UUID> {

    @Query("SELECT r.id as id, r.startTime as start_time, r.endTime as end_time, c.id as car_id FROM ReservationEntity r JOIN r.car c")
    List<ReservationProjection> findAllAsProjection();

    @Query("SELECT r.id as id, r.startTime as start_time, r.endTime as end_time, c.id as car_id FROM ReservationEntity r JOIN r.car c WHERE r.id = :reservationId")
    Optional<ReservationProjection> findAsProjection(@Param("reservationId") UUID reservationId);

    boolean existsByCarIdEqualsAndEndTimeBeforeAndStartTimeAfter(UUID carId, LocalDateTime startTime, LocalDateTime endTime);

}