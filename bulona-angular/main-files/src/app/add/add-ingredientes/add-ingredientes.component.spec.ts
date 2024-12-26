import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIngredientesComponent } from './add-ingredientes.component';

describe('AddIngredientesComponent', () => {
  let component: AddIngredientesComponent;
  let fixture: ComponentFixture<AddIngredientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIngredientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIngredientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
