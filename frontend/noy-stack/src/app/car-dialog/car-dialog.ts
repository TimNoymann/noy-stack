import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CarDto} from '../core/modules/openapi';
import {MatButtonModule} from '@angular/material/button';
import {MatError, MatFormField, MatInput} from '@angular/material/input';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {CarDialogData} from './model/CarDialogData';
import {CarStore} from '../core/state/car/car.store';

@Component({
  selector: 'app-car-dialog',
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, MatFormField, ReactiveFormsModule,
    MatInput, MatDialogClose, MatError, MatProgressSpinner],
  templateUrl: './car-dialog.html',
  styleUrl: './car-dialog.scss',
})
export class CarDialog {

  private readonly carStore = inject(CarStore);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<CarDialogData>(MAT_DIALOG_DATA, {optional: true});
  protected isEdit: boolean;

  saving = this.carStore.saveLoading;
  error = this.carStore.saveError;


  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  constructor() {
    if (this.data?.car) {
      this.form.patchValue(this.data.car);
    }
    this.isEdit = this.data?.mode === 'edit';
  }

  save() {
    if (this.form.invalid) {
      console.log('Form is invalid');
      this.form.markAllAsTouched();
      return;
    }

    const car: CarDto = {
      name: this.form.controls.name.value!,
    };
    if (this.data?.mode === 'edit') {
      this.carStore.updateCar({ id: this.data.id!, car: car });
    } else {
      this.carStore.addCar(car);
    }
  }
}
