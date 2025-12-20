import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CarDialog} from './car-dialog';
import {provideZonelessChangeDetection} from '@angular/core';
import {provideMockStore} from '@ngrx/store/testing';

describe('CarDialog', () => {
  let component: CarDialog;
  let fixture: ComponentFixture<CarDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDialog],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: {
            loading: false,
            error: null,
          }
        }),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CarDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid', () => {
    component.save();

    expect(component.form.invalid).toBeTruthy();
    expect(component.form.controls.name.touched).toBeTruthy();
  });

  it('should dispatch addCar action', () => {
    const storeSpy = spyOn(component['store'], 'dispatch');
    component.form.controls.name.setValue("Test Car");

    component.save();

    expect(storeSpy).toHaveBeenCalledWith(jasmine.objectContaining({ type: '[Car Page] Add Car', car: { name: 'Test Car' } }));
  });

});
