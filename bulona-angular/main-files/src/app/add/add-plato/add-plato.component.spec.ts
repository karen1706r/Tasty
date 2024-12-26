import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlatoComponent } from './add-plato.component';

describe('AddPlatoComponent', () => {
  let component: AddPlatoComponent;
  let fixture: ComponentFixture<AddPlatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
