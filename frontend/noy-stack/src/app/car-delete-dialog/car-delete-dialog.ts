import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';
import {CarDto} from '../core/modules/openapi';
import {MatButton} from '@angular/material/button';
import {CarStore} from '../core/state/car/car.store';

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

  private readonly carStore = inject(CarStore);
  readonly data = inject<{id: string, car: CarDto}>(MAT_DIALOG_DATA);

  error = this.carStore.deleteError;
  deleting = this.carStore.deleteLoading;

  delete() {
    this.carStore.deleteCar({id: this.data.id!});
  }
}
