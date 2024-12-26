import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMeseroComponent } from './show-mesero.component';

describe('ShowMeseroComponent', () => {
  let component: ShowMeseroComponent;
  let fixture: ComponentFixture<ShowMeseroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMeseroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMeseroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
