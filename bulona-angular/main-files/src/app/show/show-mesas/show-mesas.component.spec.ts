import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMesasComponent } from './show-mesas.component';

describe('ShowMesasComponent', () => {
  let component: ShowMesasComponent;
  let fixture: ComponentFixture<ShowMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMesasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
