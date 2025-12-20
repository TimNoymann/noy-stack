import { createFeature, createReducer, on } from '@ngrx/store';
import { CarActions, CarApiActions } from './car.actions';
import {CarResponseDto} from '../modules/openapi';

interface CarState {
  cars: CarResponseDto[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};

export const carFeature = createFeature({
  name: 'cars',
  reducer: createReducer(
    initialState,

    // When the page loads, reset error and start loading
    on(CarActions.enter, (state) => ({
      ...state,
      loading: true,
      error: null
    })),

    on(CarActions.updateCar, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),

    on(CarActions.addCar, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),

    // On success, update data and stop loading
    on(CarApiActions.loadSuccess, (state, { cars }) => ({
      ...state,
      cars,
      loading: false
    })),

    // On failure, capture error and stop loading
    on(CarApiActions.loadFailure, (state, { error }) => ({
      ...state,
      cars: [],
      loading: false,
      error
    })),

    on(CarApiActions.addSuccess, (state, { car }) => ({
      ...state,
      saving: false,
      cars: state.cars.concat(car),
    })),

    on(CarApiActions.addFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error
    })),

    on(CarApiActions.updateSuccess, (state, { car }) => ({
      ...state,
      saving: false,
      cars: state.cars.map(c => c.id === car.id ? car : c)
    })),

    on(CarApiActions.updateFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error
    })),

    on(CarApiActions.deleteSuccess, (state, { id }) => ({
      ...state,
      deleting: false,
      cars: state.cars.filter(c => c.id !== id)
    })),

    on(CarApiActions.deleteFailure, (state, { error }) => ({
      ...state,
      deleting: false,
      error
    })),
  ),
});

// Export the auto-generated selectors
export const { selectCars, selectLoading, selectSaving, selectDeleting, selectError } = carFeature;
