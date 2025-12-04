export * from './car.service';
import { CarService } from './car.service';
export * from './car.serviceInterface';
export * from './reservation.service';
import { ReservationService } from './reservation.service';
export * from './reservation.serviceInterface';
export const APIS = [CarService, ReservationService];
