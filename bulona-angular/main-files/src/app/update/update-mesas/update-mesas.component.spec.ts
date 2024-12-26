import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMesasComponent } from './update-mesas.component';

describe('UpdateMesasComponent', () => {
  let component: UpdateMesasComponent;
  let fixture: ComponentFixture<UpdateMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMesasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
