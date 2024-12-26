import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMesasComponent } from './add-mesas.component';

describe('AddMesasComponent', () => {
  let component: AddMesasComponent;
  let fixture: ComponentFixture<AddMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMesasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
