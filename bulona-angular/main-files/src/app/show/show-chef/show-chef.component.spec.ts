import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChefComponent } from './show-chef.component';

describe('ShowChefComponent', () => {
  let component: ShowChefComponent;
  let fixture: ComponentFixture<ShowChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowChefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
