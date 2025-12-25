import {Component, effect, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CarDto} from '../core/modules/openapi';
import {MatButtonModule} from '@angular/material/button';
import {MatError, MatFormField, MatInput} from '@angular/material/input';
import {Store} from '@ngrx/store';
import {CarActions} from '../core/car/car.actions';
import {selectError, selectSaving} from '../core/car/car.feature';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {CarDialogData} from './model/CarDialogData';

@Component({
  selector: 'app-car-dialog',
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, MatFormField, ReactiveFormsModule,
    MatInput, MatDialogClose, MatError, MatProgressSpinner],
  templateUrl: './car-dialog.html',
  styleUrl: './car-dialog.scss',
})
export class CarDialog {

  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<CarDialogData>(MAT_DIALOG_DATA, {optional: true});
  protected isEdit: boolean;

  saving = this.store.selectSignal(selectSaving);
  error = this.store.selectSignal(selectError);


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
      this.form.markAllAsTouched();
      return;
    }

    const car: CarDto = {
      name: this.form.controls.name.value!,
    };
    if (this.data?.mode === 'edit') {
      this.store.dispatch(
        CarActions.updateCar({ id: this.data.id!, car })
      );
    } else {
      this.store.dispatch(
        CarActions.addCar({ car })
      );
    }
  }
}
