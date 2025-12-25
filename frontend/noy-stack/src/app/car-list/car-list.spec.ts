import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CarList} from './car-list';
import {provideZonelessChangeDetection} from '@angular/core';
import {CarService} from '../core/modules/openapi';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

describe('CarList', () => {
  let component: CarList;
  let fixture: ComponentFixture<CarList>;
  let storeMock: MockStore;

  const initialState = {
    car: {
      cars: [],
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarList],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({initialState}),
        CarService]
    })
      .compileComponents();

    storeMock = TestBed.inject(MockStore)
    fixture = TestBed.createComponent(CarList);
    component = fixture.componentInstance;
  });

  it('should display cars from store', async () => {
    storeMock.setState({
      car: {
        cars: [
          {id: '1', name: 'VW'},
          {id: '2', name: 'BMW'}
        ],
        loading: false,
        error: null
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.cars()).toHaveSize(2);
    const dataRows = fixture.nativeElement.querySelectorAll('tr');
    expect(dataRows.length).toBe(3);
  });

  it('should show loading state', async () => {
    storeMock.setState({
      car: {
        cars: [],
        loading: true,
        error: null
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const spinner = fixture.nativeElement.querySelector('mat-progress-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show error state', async () => {
    storeMock.setState({
      car: {
        cars: [],
        loading: false,
        error: 'Failed to load cars'
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement.textContent).toContain('Error');
  });

});
