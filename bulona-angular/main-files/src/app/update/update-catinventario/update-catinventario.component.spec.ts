import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCatinventarioComponent } from './update-catinventario.component';

describe('UpdateCatinventarioComponent', () => {
  let component: UpdateCatinventarioComponent;
  let fixture: ComponentFixture<UpdateCatinventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCatinventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCatinventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
