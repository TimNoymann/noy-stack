import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {CarResponseDto, CarService} from '../core/modules/openapi';
import {NgForOf} from '@angular/common';
import {of} from 'rxjs';

@Component({
  selector: 'app-car-list',
  imports: [
    NgForOf
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarList implements OnInit {

  cars: WritableSignal<CarResponseDto[]> = signal([]);

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        console.log(cars);
        this.cars.set(cars);
      },
      error: (err) => {
        console.error('Failed to load cars', err);
      },
    });
  }

  protected readonly of = of;
}
