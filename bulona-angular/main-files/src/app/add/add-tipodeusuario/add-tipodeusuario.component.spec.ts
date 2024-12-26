import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTipodeusuarioComponent } from './add-tipodeusuario.component';

describe('AddTipodeusuarioComponent', () => {
  let component: AddTipodeusuarioComponent;
  let fixture: ComponentFixture<AddTipodeusuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTipodeusuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipodeusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
