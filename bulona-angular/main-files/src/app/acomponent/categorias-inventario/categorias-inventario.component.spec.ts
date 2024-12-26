import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasInventarioComponent } from './categorias-inventario.component';

describe('CategoriasInventarioComponent', () => {
  let component: CategoriasInventarioComponent;
  let fixture: ComponentFixture<CategoriasInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriasInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
