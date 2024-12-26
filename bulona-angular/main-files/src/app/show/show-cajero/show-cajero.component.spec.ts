import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCajeroComponent } from './show-cajero.component';

describe('ShowCajeroComponent', () => {
  let component: ShowCajeroComponent;
  let fixture: ComponentFixture<ShowCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCajeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
