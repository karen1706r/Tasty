import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-mesero',
  templateUrl: './show-mesero.component.html',
  styleUrls: ['./show-mesero.component.scss']
})
export class ShowMeseroComponent implements OnInit {
  public mesas: any[] = [];
  public pedidos: any[] = [];
  public userId: string = '';

  constructor(private ps: RestauranteService, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.getLoggedInUserId();
    this.loadPedidos();  // Cargar pedidos antes de las mesas
  }

  private getLoggedInUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  private loadPedidos(): void {
    this.ps.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        console.log('Pedidos cargados:', this.pedidos);
        this.loadMesas(); // Después de cargar los pedidos, cargar las mesas
      },
      error: (err) => console.error('Error al cargar los pedidos:', err)
    });
  }

  private loadMesas(): void {
    this.ps.getMesas().subscribe({
      next: (data) => {
        this.mesas = data
          .filter(mesa => this.convertirEstado(mesa.estado))
          .map(mesa => ({
            ...mesa,
            numero: mesa.numero || mesa.id,
            ocupada: this.checkIfPedidoActivo(mesa.id)  // Añadir propiedad ocupada según el estado del pedido
          }));
        console.log('Mesas cargadas:', this.mesas);
      },
      error: (err) => console.error('Error al cargar las mesas:', err)
    });
  }

  checkIfPedidoActivo(mesaId: string): boolean {
    // Revisar si hay algún pedido activo para la mesa
    return this.pedidos.some(pedido => pedido.id_mesa === mesaId && pedido.estado_pedido);
  }

  vermesas(id: string, event: Event): void {
    event.preventDefault();
    this.router.navigate(['dashboard/pedidos-por-mesas/', id]);
  }

  private convertirEstado(valor: any): boolean {
    return typeof valor === 'string' ? valor.toLowerCase() === 'true' : !!valor;
  }
}
