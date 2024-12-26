import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIngredientesComponent } from './update-ingredientes.component';

describe('UpdateIngredientesComponent', () => {
  let component: UpdateIngredientesComponent;
  let fixture: ComponentFixture<UpdateIngredientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateIngredientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateIngredientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
