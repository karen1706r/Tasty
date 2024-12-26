import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowParrillaComponent } from './show-parrilla.component';

describe('ShowParrillaComponent', () => {
  let component: ShowParrillaComponent;
  let fixture: ComponentFixture<ShowParrillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowParrillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowParrillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
