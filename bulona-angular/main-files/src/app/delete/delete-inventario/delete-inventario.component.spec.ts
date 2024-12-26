import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInventarioComponent } from './delete-inventario.component';

describe('DeleteInventarioComponent', () => {
  let component: DeleteInventarioComponent;
  let fixture: ComponentFixture<DeleteInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
