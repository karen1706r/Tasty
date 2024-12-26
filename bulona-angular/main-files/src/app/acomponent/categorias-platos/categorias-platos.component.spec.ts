import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasPlatosComponent } from './categorias-platos.component';

describe('CategoriasPlatosComponent', () => {
  let component: CategoriasPlatosComponent;
  let fixture: ComponentFixture<CategoriasPlatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriasPlatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasPlatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
