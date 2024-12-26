import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesUsuariosComponent } from './sesiones-usuarios.component';

describe('SesionesUsuariosComponent', () => {
  let component: SesionesUsuariosComponent;
  let fixture: ComponentFixture<SesionesUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesionesUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionesUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
