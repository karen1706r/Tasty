import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlatosIngredientesComponent } from './update-platos-ingredientes.component';

describe('UpdatePlatosIngredientesComponent', () => {
  let component: UpdatePlatosIngredientesComponent;
  let fixture: ComponentFixture<UpdatePlatosIngredientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePlatosIngredientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePlatosIngredientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
