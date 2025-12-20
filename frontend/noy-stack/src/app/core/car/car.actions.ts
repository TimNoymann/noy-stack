import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {CarDto, CarResponseDto} from '../modules/openapi';

// Actions dispatched by the Component
export const CarActions = createActionGroup({
  source: 'Car Page',
  events: {
    'Enter': emptyProps(), // Component initialized
    'AddClicked': emptyProps(),
    'EditClicked': props<{ id: string, car: CarDto }>(),
    'DeleteClicked': props<{ id: string, car: CarDto  }>(),
    'Refresh List': emptyProps(),
    'Update Car': props<{ id: string, car: CarDto }>(),
    'Add Car': props<{ car: CarDto }>(),
    'Delete Car': props<{ id: string }>(),
  }
});

// Actions dispatched by the API Effect
export const CarApiActions = createActionGroup({
  source: 'Car API',
  events: {
    'Load Success': props<{ cars: CarResponseDto[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Add Success': props<{ car: CarResponseDto }>(),
    'Add Failure': props<{ error: string }>(),
    'Update Success': props<{ car: CarResponseDto }>(),
    'Update Failure': props<{ error: string }>(),
    'Delete Success': props<{ id: string }>(),
    'Delete Failure': props<{ error: string }>(),
  }
});
