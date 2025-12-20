import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, of, exhaustMap, tap} from 'rxjs';
import {CarActions, CarApiActions} from './car.actions';
import {CarService} from '../modules/openapi';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CarDialog} from '../../car-dialog/car-dialog';
import {CarDialogData} from '../../car-dialog/model/CarDialogData';
import {CarDeleteDialog} from '../../car-delete-dialog/car-delete-dialog';

@Injectable()
export class CarEffects {
  private actions = inject(Actions);
  private carService = inject(CarService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  openDialog$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(CarActions.addClicked),
        tap(() => this.dialog.open(CarDialog, {
            data: {
              mode: 'create'
            } satisfies CarDialogData,
          }),
        )
      );
    },
    {dispatch: false}
  );

  editDialog$ = createEffect(() =>
    this.actions.pipe(
      ofType(CarActions.editClicked),
      tap(({id, car}) => {
        this.dialog.open(CarDialog, {
            data: {
              mode: 'edit',
              id: id,
              car: car,
            } satisfies CarDialogData
          }
        );
      })
    ),
    {dispatch: false}
  );

  deleteDialog$ = createEffect(() =>
    this.actions.pipe(
      ofType(CarActions.deleteClicked),
      tap(({id, car}) => {
        this.dialog.open(CarDeleteDialog, {
            data: {
              id: id,
              car: car,
            }
        })
      })
    ),
    {dispatch: false}
  );

  loadCarsEffect$ = createEffect(() =>
    this.actions.pipe(
      ofType(CarActions.enter, CarActions.refreshList),
      switchMap(() =>
        this.carService.getCars().pipe(
          map((cars) => CarApiActions.loadSuccess({cars})),
          catchError((error) =>
            of(CarApiActions.loadFailure({error: error.message}))
          )
        )
      )
    )
  );

  addCar$ = createEffect(() =>
    this.actions.pipe(
      ofType(CarActions.addCar),
      exhaustMap(({car}) =>
        this.carService.postCar(car, 'response').pipe(
          switchMap((response) => {
            console.log(response);
            const location = response.headers.get('Location');
            if (!location) {
              throw new Error('Location header missing');
            }

            const id = location.split('/').pop()!;
            return this.carService.getCarById(id);
          }),

          map((newCar) => CarApiActions.addSuccess({car: newCar})),
          tap(() => {
            this.dialog.closeAll();
            this.snackBar.open('Car saved successfully', 'Close', {duration: 3000});
          }),

          catchError((error) => of(CarApiActions.addFailure({error})))
        )
      )
    )
  );

  updateCarEffect$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(CarActions.updateCar),
        exhaustMap(({id, car}) =>
          this.carService.putCar(id, car).pipe(
            map((updatedCar) => CarApiActions.updateSuccess({car: updatedCar})),
            tap(() => {
              this.dialog.closeAll();
              this.snackBar.open('Car updated successfully', 'Close', {duration: 3000});
            }),
            catchError((error) =>
              of(CarApiActions.updateFailure({error: error.message}))
            )
          )
        )
      )
    }
  );

  deleteCarEffect$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(CarActions.deleteCar),
        exhaustMap(({id}) =>
          this.carService.deleteCar(id).pipe(
            map(() => CarApiActions.deleteSuccess({id: id})),
            tap(() => {
              this.dialog.closeAll();
              this.snackBar.open('Car deleted successfully', 'Close', {duration: 3000});
            }),
            catchError((error) =>
              of(CarApiActions.deleteFailure({error: error.message}))
            )
          )
        )
      )
    }
  );

}
