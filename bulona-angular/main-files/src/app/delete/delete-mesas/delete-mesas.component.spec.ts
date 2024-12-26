import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMesasComponent } from './delete-mesas.component';

describe('DeleteMesasComponent', () => {
  let component: DeleteMesasComponent;
  let fixture: ComponentFixture<DeleteMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMesasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
