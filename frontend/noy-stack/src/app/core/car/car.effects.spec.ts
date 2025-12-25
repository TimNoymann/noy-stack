import {TestBed} from '@angular/core/testing';
import {CarEffects} from './car.effects';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, of} from 'rxjs';
import {CarResponseDto, CarService} from '../modules/openapi';
import {MatDialog} from '@angular/material/dialog';
import {provideMockActions} from '@ngrx/effects/testing';
import {CarActions, CarApiActions} from './car.actions';
import {provideHttpClient} from '@angular/common/http';
import {provideZonelessChangeDetection} from '@angular/core';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

describe('CarEffects', () => {
  let effects: CarEffects;
  let actions$: Observable<any>;

  let httpMock: HttpTestingController;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        CarEffects,
        CarService,
        provideZonelessChangeDetection(),
        provideMockActions(() => actions$),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    effects = TestBed.inject(CarEffects);
  })

  afterEach(() => {
    httpMock.verify();
  });

  it('should dispatch loadSuccess when cars are loaded', (done) => {
    const cars: Array<CarResponseDto> = [{ id: '1', name: 'BMW' }];

    actions$ = of(CarActions.enter());

    effects.loadCarsEffect$.subscribe(action => {
      expect(action).toEqual(
        CarApiActions.loadSuccess({ cars })
      );
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/car');
    expect(req.request.method).toBe('GET');
    req.flush(cars);
  });
});
