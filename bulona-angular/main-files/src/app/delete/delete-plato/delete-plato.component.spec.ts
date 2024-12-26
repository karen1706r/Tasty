import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlatoComponent } from './delete-plato.component';

describe('DeletePlatoComponent', () => {
  let component: DeletePlatoComponent;
  let fixture: ComponentFixture<DeletePlatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePlatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePlatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
