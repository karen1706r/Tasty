import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlatosIngredientesComponent } from './add-platos-ingredientes.component';

describe('AddPlatosIngredientesComponent', () => {
  let component: AddPlatosIngredientesComponent;
  let fixture: ComponentFixture<AddPlatosIngredientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlatosIngredientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlatosIngredientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
