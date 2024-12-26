import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

interface Mesa {
  id: number;
  numero: string;
  estado: boolean;
}

interface Pedido {
  id: number;
  id_mesa: number;
  estado_pedido: boolean;
}

@Component({
  selector: 'app-show-cajero',
  templateUrl: './show-cajero.component.html',
  styleUrls: ['./show-cajero.component.scss']
})
export class ShowCajeroComponent implements OnInit, OnDestroy {
  mesas: Mesa[] = [];
  pedidos: Pedido[] = [];
  private pollingSubscription: Subscription | null = null; // Subscripción para el polling

  constructor(
    private restauranteService: RestauranteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMesas();  // Cargar mesas y pedidos inicialmente
    this.cargarPedidos();

    // Configurar polling para recargar mesas y pedidos cada 5 segundos
    this.pollingSubscription = interval(2000).subscribe(() => {
      this.cargarMesas();
      this.cargarPedidos();
    });
  }

  ngOnDestroy(): void {
    // Detener el polling cuando el componente se destruye
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  cargarMesas(): void {
    this.restauranteService.getMesas().subscribe(
      (data) => {
        this.mesas = data;
        
      },
      (error) => {
        
      }
    );
  }

  cargarPedidos(): void {
    this.restauranteService.getpedidos().subscribe(
      (data) => {
        this.pedidos = data;
        
      },
      (error) => {
        
      }
    );
  }

  tienePedido(idMesa: number): boolean {
    return this.pedidos.some((pedido) => pedido.id_mesa === idMesa && pedido.estado_pedido);
  }

  verFactura(idMesa: number): void {
    if (this.tienePedido(idMesa)) {
      this.router.navigate(['dashboard/factura', idMesa]);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Sin pedidos activos',
        text: `No hay facturas pendientes para esta Mesa`,
        confirmButtonText: 'Aceptar'
      });
    }
  }
}
