import {Component, inject, OnInit, Signal} from '@angular/core';
import {CarDto, CarResponseDto} from '../core/modules/openapi';
import {of} from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {CarStore} from '../core/state/car/car.store';

@Component({
  selector: 'app-car-list',
  imports: [
    MatTableModule,
    MatButton,
    FormsModule,
    MatDialogModule,
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    MatTooltip
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarList implements OnInit {

  private carStore = inject(CarStore);

  cars: Signal<CarResponseDto[]> = this.carStore.entities
  loading = this.carStore.selectLoading
  error = this.carStore.selectError

  displayedColumns: string[] = ['id', 'name', 'actions'];

  ngOnInit(): void {
    this.carStore.enter();
  }

  protected readonly of = of;

  deleteCar(id: string, car: CarDto) {
    this.carStore.openDeleteDialog(id, car);
  }

  addCar() {
    this.carStore.openAddCarDialog();
  }

  editCar(id: string, car: CarDto) {
    this.carStore.openEditDialog(id, car);
  }
}
