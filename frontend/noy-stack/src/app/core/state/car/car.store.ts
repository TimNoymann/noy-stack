import {CarDto, CarResponseDto, CarService} from '../../modules/openapi';
import {patchState, signalStore, withMethods} from '@ngrx/signals';
import {inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CarDialog} from '../../../car-dialog/car-dialog';
import {CarDialogData} from '../../../car-dialog/model/CarDialogData';
import {CarDeleteDialog} from '../../../car-delete-dialog/car-delete-dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, EMPTY, exhaustMap, map, pipe, switchMap, tap} from 'rxjs';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {addEntity, removeEntity, setAllEntities, updateEntity, withEntities} from '@ngrx/signals/entities';
import {withSelectState} from '../shared/select.store.feature';
import {withSavingState} from '../shared/save.store.feature';
import {withDeleteState} from '../shared/delete.store.feature';

export const CarStore = signalStore(
  {providedIn: 'root'},

  withEntities<CarResponseDto>(),

  withSelectState(),
  withSavingState(),
  withDeleteState(),

  withMethods((store) => {
    const carService = inject(CarService);
    const dialog = inject(MatDialog);
    const snackBar = inject(MatSnackBar);

    return {
      openAddCarDialog() {
        dialog.open(CarDialog, {
          data: {
            mode: 'create',
          } satisfies CarDialogData,
        });
      },

      openEditDialog(id: string, car: CarDto) {
        dialog.open(CarDialog, {
          data: {
            mode: 'edit',
            id,
            car,
          } satisfies CarDialogData,
        });
      },

      openDeleteDialog(id: string, car: CarDto) {
        dialog.open(CarDeleteDialog, {
          data: {id, car},
        });
      },

      enter: rxMethod<void>(
        pipe(
          tap(() => store.setSelectLoading()),
          switchMap(() => carService.getCars().pipe(
              map((cars) => {
                patchState(store, setAllEntities<CarResponseDto>(cars));
                store.setSelectLoaded();
              }),
              catchError((error) => {
                patchState(store, setAllEntities<CarResponseDto>([]));
                store.setSelectError(error.message);
                return EMPTY;
              })
            ),
          ),
        ),
      ),

      addCar: rxMethod<CarDto>(
        pipe(
          tap(() => store.setSaveLoading()),
          exhaustMap((car: CarDto) =>
            carService.postCar(car, 'response').pipe(
              switchMap((response) => {
                console.log(response);
                const location = response.headers.get('Location');
                if (!location) {
                  throw new Error('Location header missing');
                }

                const id = location.split('/').pop()!;
                return carService.getCarById(id);
              }),

              map((newCar) => {
                patchState(store, addEntity(newCar));
                store.setSaveLoaded();
              }),

              tap(() => {
                dialog.closeAll();
                snackBar.open('Car saved successfully', 'Close', {duration: 3000});
              }),

              catchError((error) => {
                store.setSaveError(error.message)
                return EMPTY;
              })
            )
          ),
        )
      ),

      updateCar: rxMethod<{ id: string; car: CarDto }>(
        pipe(
          tap(() => store.setSaveLoading()),

          exhaustMap(({ id, car }) =>
            carService.putCar(id, car).pipe(
              tap((updatedCar) => {
                patchState(store, updateEntity({
                  id: updatedCar.id,
                  changes: updatedCar
                }));

                dialog.closeAll();
                snackBar.open('Car updated successfully', 'Close', { duration: 3000 });

                store.setSaveLoaded();
              }),

              catchError((error) => {
                store.setSaveError(error.message ?? 'Unknown error');
                return EMPTY;
              })
            )
          )
        )
      ),

      deleteCar: rxMethod<{ id: string }>(
        pipe(
          tap(() => store.setDeleteLoading()),
          exhaustMap(({ id }) =>
            carService.deleteCar(id).pipe(
              tap(() => {
                patchState(store, removeEntity(id));
                store.setDeleteLoaded();
                dialog.closeAll();
                snackBar.open('Car deleted successfully', 'Close', {duration: 3000});
              }),
              catchError((error) => {
                store.setDeleteError(error.message);
                return EMPTY;
              })
            )
          )
        )
      )
    }
  }),
)
