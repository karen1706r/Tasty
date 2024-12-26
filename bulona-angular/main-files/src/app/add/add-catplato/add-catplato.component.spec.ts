import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCatplatoComponent } from './add-catplato.component';

describe('AddCatplatoComponent', () => {
  let component: AddCatplatoComponent;
  let fixture: ComponentFixture<AddCatplatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCatplatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCatplatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
