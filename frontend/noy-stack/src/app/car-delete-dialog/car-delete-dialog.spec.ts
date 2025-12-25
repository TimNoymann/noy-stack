import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDeleteDialog } from './car-delete-dialog';
import {provideZonelessChangeDetection} from '@angular/core';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {CarDto} from '../core/modules/openapi';
import {CarActions} from '../core/car/car.actions';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

describe('CarDeleteDialog', () => {
  let component: CarDeleteDialog;
  let fixture: ComponentFixture<CarDeleteDialog>;
  let storeMock: MockStore;

  const initialState = {
    car: {
      deleting: false,
      error: null
    }
  }

  const mockCar: CarDto = {
    name: 'BMW',
  } as CarDto;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDeleteDialog],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({initialState}),
        { provide: MAT_DIALOG_DATA, useValue: { id: 'car-1', car: mockCar } }
      ]
    })
    .compileComponents();

    storeMock = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CarDeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch deleteCar action on delete()', async () => {
    const dispatchSpy = spyOn(storeMock, 'dispatch');

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const deleteButton = await loader.getHarness(
      MatButtonHarness.with({text: 'Delete'})
    );
    console.log('Clicking delete button');
    console.log(deleteButton);
    await deleteButton.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      CarActions.deleteCar({id: 'car-1'})
    );
  });
});
