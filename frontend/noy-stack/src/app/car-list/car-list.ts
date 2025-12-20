import {Component, inject, OnInit, Signal} from '@angular/core';
import {CarDto, CarResponseDto} from '../core/modules/openapi';
import {of} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectCars, selectError, selectLoading} from '../core/car/car.feature';
import {CarActions} from '../core/car/car.actions';
import {MatTableModule} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

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

  private store = inject(Store);
  readonly dialog: MatDialog = inject(MatDialog);

  cars: Signal<CarResponseDto[]> = this.store.selectSignal(selectCars);
  loading = this.store.selectSignal(selectLoading);
  error = this.store.selectSignal(selectError);

  displayedColumns: string[] = ['id', 'name', 'actions'];

  ngOnInit(): void {
    this.store.dispatch(CarActions.enter());
  }

  protected readonly of = of;

  deleteCar(id: string, car: CarDto) {
    this.store.dispatch(CarActions.deleteClicked({id: id, car: car}));
  }

  addCar() {
    this.store.dispatch(CarActions.addClicked());
  }

  editCar(id: string, car: CarDto) {
    this.store.dispatch(CarActions.editClicked(
      {id: id, car: car}
    ))
  }
}
