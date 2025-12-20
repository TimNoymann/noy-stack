import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDeleteDialog } from './car-delete-dialog';
import {provideZonelessChangeDetection} from '@angular/core';

describe('CarDeleteDialog', () => {
  let component: CarDeleteDialog;
  let fixture: ComponentFixture<CarDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDeleteDialog],
      providers: [
        provideZonelessChangeDetection(),
      ]
    })
    .compileComponents();


    fixture = TestBed.createComponent(CarDeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
