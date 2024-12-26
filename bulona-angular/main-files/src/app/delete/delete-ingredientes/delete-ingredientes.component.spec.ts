import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIngredientesComponent } from './delete-ingredientes.component';

describe('DeleteIngredientesComponent', () => {
  let component: DeleteIngredientesComponent;
  let fixture: ComponentFixture<DeleteIngredientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteIngredientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteIngredientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
