import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlatosIngredientesComponent } from './delete-platos-ingredientes.component';

describe('DeletePlatosIngredientesComponent', () => {
  let component: DeletePlatosIngredientesComponent;
  let fixture: ComponentFixture<DeletePlatosIngredientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePlatosIngredientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePlatosIngredientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
