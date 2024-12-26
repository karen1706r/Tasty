import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInventarioComponent } from './update-inventario.component';

describe('UpdateInventarioComponent', () => {
  let component: UpdateInventarioComponent;
  let fixture: ComponentFixture<UpdateInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
