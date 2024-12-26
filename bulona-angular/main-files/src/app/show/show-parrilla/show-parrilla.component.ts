import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-show-parrilla',
  templateUrl: './show-parrilla.component.html',
  styleUrls: ['./show-parrilla.component.scss']
})
export class ShowParrillaComponent implements OnInit {
  public pedidos: any[] = []; // Array para almacenar la lista de pedidos
  public categorias: any[] = []; // Array para almacenar la lista de categorías
  public mesas: any = {}; // Objeto para almacenar el número de la mesa por ID
  private pollingSubscription: Subscription | null = null; // Subscripción para el polling

  constructor(
    private restauranteService: RestauranteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMesas(); // Carga inicial de las mesas y pedidos

    // Configurar polling para recargar los pedidos cada 2 segundos
    this.pollingSubscription = interval(2000).subscribe(() => {
      this.cargarPedidos(); // Actualizar pedidos cada 2 segundos (o ajusta según necesites)
    });
  }

  ngOnDestroy(): void {
    // Detener el polling cuando el componente se destruye
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  // Método para cargar las mesas y luego los pedidos
  cargarMesas(): void {
    this.restauranteService.getMesas().subscribe({
      next: (data) => {
        this.mesas = data.reduce((acc: any, mesa: any) => {
          acc[mesa.id] = mesa.numero;
          return acc;
        }, {});

        // Aquí debes llamar a la función cargarCategoriasPorMesa para cargar las categorías
        // Puedes elegir cargar las categorías para una mesa en específico, por ejemplo, la primera mesa
        if (data.length > 0) {
          const primerPedido = data[0].pedidos; // Suponiendo que la mesa tiene pedidos relacionados
          const idPedido = primerPedido ? primerPedido.id : null;
          const idPlato = primerPedido ? primerPedido.id_plato : null;

          if (idPedido && idPlato) {
            this.cargarPedidoPorMesaYPlato(idPedido, idPlato);
          }
        }

        this.cargarPedidos(); // Cargar pedidos una vez obtenidas las mesas
      },
      error: (err) => {
        alert('Ocurrió un error al obtener las mesas.');
      }
    });
  }

  verComanda(id: string): void {
    this.router.navigate(['dashboard/show-comanda/' + id]);
  }

  cargarPedidoPorMesaYPlato(idPedido: number, idPlato: number): void {
    this.restauranteService.getPedidoPorMesaYPlato(idPedido, idPlato).subscribe({
      next: (pedido) => {
        console.log('Pedido por mesa y plato:', pedido);
        this.categorias = [pedido.id_categoria]; // Aquí tienes el id_categoria del pedido
      },
      error: (err) => {
        alert('Ocurrió un error al obtener el pedido.');
      }
    });
  }

  // Método para cargar los pedidos
  cargarPedidos(): void {
    this.restauranteService.getPedidosChef().subscribe({
      next: (data) => {
        // Filtrar por estados_p y excluir los pedidos con id_categoria = 9
        this.pedidos = data.filter((pedido: any) =>
          pedido.estados_p &&
          !pedido.pedidos_por_mesa_models.some((mesa: any) => mesa.id_categoria === 9)
        ).map((pedido: any) => {
          const pedidoFecha = new Date(pedido.fecha); // Fecha del pedido
          const ahora = new Date(); // Fecha actual
          const diferenciaMs = ahora.getTime() - pedidoFecha.getTime(); // Diferencia en milisegundos
          pedido.tiempoEspera = this.convertirMsATiempo(diferenciaMs); // Convertir a formato legible
          return pedido;
        });
      },
      error: (err) => {
        alert('Ocurrió un error al obtener los pedidos.');
      }
    });
  }

  convertirMsATiempo(ms: number): string {
    const segundos = Math.floor((ms / 1000) % 60);
    const minutos = Math.floor((ms / (1000 * 60)) % 60);
    const horas = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
    const horasStr = horas.toString().padStart(2, '0');
    const minutosStr = minutos.toString().padStart(2, '0');
    const segundosStr = segundos.toString().padStart(2, '0');
  
    return `${horasStr}:${minutosStr}:${segundosStr}`;
  }
  
  
}
