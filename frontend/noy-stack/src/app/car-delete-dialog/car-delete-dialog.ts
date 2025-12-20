import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Store} from '@ngrx/store';
import {selectDeleting, selectError} from '../core/car/car.feature';
import {MatError} from '@angular/material/form-field';
import {CarActions} from '../core/car/car.actions';
import {CarDto} from '../core/modules/openapi';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-car-delete-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatProgressSpinner,
    MatError,
    MatDialogTitle,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './car-delete-dialog.html',
  styleUrl: './car-delete-dialog.scss',
})
export class CarDeleteDialog {

  private readonly store = inject(Store);
  readonly data = inject<{id: string, car: CarDto}>(MAT_DIALOG_DATA);

  error = this.store.selectSignal(selectError);
  deleting = this.store.selectSignal(selectDeleting);

  delete() {
    this.store.dispatch(CarActions.deleteCar({ id: this.data.id }));
  }
}
