import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposDeUsuarioComponent } from './tipos-de-usuario.component';

describe('TiposDeUsuarioComponent', () => {
  let component: TiposDeUsuarioComponent;
  let fixture: ComponentFixture<TiposDeUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposDeUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposDeUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
