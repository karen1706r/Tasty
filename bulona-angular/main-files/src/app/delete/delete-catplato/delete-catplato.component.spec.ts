import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCatplatoComponent } from './delete-catplato.component';

describe('DeleteCatplatoComponent', () => {
  let component: DeleteCatplatoComponent;
  let fixture: ComponentFixture<DeleteCatplatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCatplatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCatplatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
