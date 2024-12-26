import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTipodeusuarioComponent } from './delete-tipodeusuario.component';

describe('DeleteTipodeusuarioComponent', () => {
  let component: DeleteTipodeusuarioComponent;
  let fixture: ComponentFixture<DeleteTipodeusuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTipodeusuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTipodeusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
