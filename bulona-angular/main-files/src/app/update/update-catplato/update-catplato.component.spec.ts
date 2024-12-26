import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCatplatoComponent } from './update-catplato.component';

describe('UpdateCatplatoComponent', () => {
  let component: UpdateCatplatoComponent;
  let fixture: ComponentFixture<UpdateCatplatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCatplatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCatplatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
