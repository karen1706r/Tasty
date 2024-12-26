import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCatinventarioComponent } from './delete-catinventario.component';

describe('DeleteCatinventarioComponent', () => {
  let component: DeleteCatinventarioComponent;
  let fixture: ComponentFixture<DeleteCatinventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCatinventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCatinventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
