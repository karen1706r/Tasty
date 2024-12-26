import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCatinventarioComponent } from './add-catinventario.component';

describe('AddCatinventarioComponent', () => {
  let component: AddCatinventarioComponent;
  let fixture: ComponentFixture<AddCatinventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCatinventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCatinventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
