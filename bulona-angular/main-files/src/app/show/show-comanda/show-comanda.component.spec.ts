import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowComandaComponent } from './show-comanda.component';

describe('ShowComandaComponent', () => {
  let component: ShowComandaComponent;
  let fixture: ComponentFixture<ShowComandaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowComandaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowComandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
