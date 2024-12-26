import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTipodeusuarioComponent } from './update-tipodeusuario.component';

describe('UpdateTipodeusuarioComponent', () => {
  let component: UpdateTipodeusuarioComponent;
  let fixture: ComponentFixture<UpdateTipodeusuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTipodeusuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTipodeusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
