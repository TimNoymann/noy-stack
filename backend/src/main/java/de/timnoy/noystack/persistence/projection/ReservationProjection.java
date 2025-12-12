package de.timnoy.noystack.persistence.projection;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationProjection(UUID id, UUID carId, LocalDateTime startTime, LocalDateTime endTime) {
}
