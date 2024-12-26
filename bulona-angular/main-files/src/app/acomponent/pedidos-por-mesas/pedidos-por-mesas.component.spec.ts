import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosPorMesasComponent } from './pedidos-por-mesas.component';

describe('PedidosPorMesasComponent', () => {
  let component: PedidosPorMesasComponent;
  let fixture: ComponentFixture<PedidosPorMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosPorMesasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosPorMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
