import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatosIngredientesComponent } from './platos-ingredientes.component';

describe('PlatosIngredientesComponent', () => {
  let component: PlatosIngredientesComponent;
  let fixture: ComponentFixture<PlatosIngredientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatosIngredientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatosIngredientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
