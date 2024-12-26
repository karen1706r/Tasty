import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPreparacionesComponent } from './show-preparaciones.component';

describe('ShowPreparacionesComponent', () => {
  let component: ShowPreparacionesComponent;
  let fixture: ComponentFixture<ShowPreparacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPreparacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPreparacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
