import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlatoComponent } from './update-plato.component';

describe('UpdatePlatoComponent', () => {
  let component: UpdatePlatoComponent;
  let fixture: ComponentFixture<UpdatePlatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePlatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePlatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
