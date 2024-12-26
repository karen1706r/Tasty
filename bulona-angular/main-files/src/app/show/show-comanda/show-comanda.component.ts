import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-show-comanda',
  templateUrl: './show-comanda.component.html',
  styleUrls: ['./show-comanda.component.scss']
})
export class ShowComandaComponent implements OnInit {
  
  public pedidosPorMesa: any[] = []; // Array para almacenar los pedidos
  public loading: boolean = true; // Para mostrar el estado de carga
  mostrarModalOpciones: boolean = false;
  comandaMiniatura: string | null = null;
  @ViewChild('comanda') facturaElement!: ElementRef;
  @ViewChild('comandaVoucher') comandaVoucher!: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private restauranteService: RestauranteService,
    private route: ActivatedRoute,
    private router2: Router
  ) {}

  ngOnInit(): void {
    // Captura el ID del pedido desde la URL

    const pedidoId = this.route.snapshot.paramMap.get('id');

    if (pedidoId) {
      this.cargarPedidosPorMesa(pedidoId);
    } else {
      console.error('No se encontró el ID del pedido en la URL.');
    }
  }

  ngAfterViewInit(): void {
    this.generarMiniaturaComanda();
  }


  // Método para cargar el pedido específico y obtener el nombre del plato
  cargarPedidosPorMesa(pedidoId: string): void {
    this.loading = true; // Iniciar el estado de carga
    this.restauranteService.getPedidosPorMesa().subscribe({
      next: (data) => {
        this.pedidosPorMesa = data.filter(pedido => pedido.id_pedido === +pedidoId);
        console.log('Pedido específico:', this.pedidosPorMesa);

        // Obtener el nombre del plato para el pedido específico
        this.pedidosPorMesa.forEach(pedido => {
          this.restauranteService.getplatosId(pedido.id_plato).subscribe({
            next: (platoData) => {
              pedido.nombre_plato = platoData.nombre; // Agregar nombre del plato al pedido
            },
            error: (err) => {
              console.error('Error al cargar el plato:', err);
              pedido.nombre_plato = 'Plato no encontrado'; // Manejo en caso de error
            }
          });
        });
      },
      error: (err) => {
        console.error('Error al obtener el pedido:', err);
        Swal.fire('Error', 'Ocurrió un error al obtener el pedido.', 'error');
      },
      complete: () => {
        this.loading = false; // Cambiar el estado de carga al completar
        this.verificarPedidosYLimpiar(); // Verificar si hay pedidos
      }
    });
  }

  
  
  generarMiniaturaComanda(): void {
    if (this.comandaVoucher && this.comandaVoucher.nativeElement) {
      html2canvas(this.comandaVoucher.nativeElement).then(canvas => {
        this.comandaMiniatura = canvas.toDataURL('image/png');
        this.cdr.detectChanges(); // Forzar la detección de cambios
        console.log("Miniatura generada con éxito:", this.comandaMiniatura);
      }).catch(error => {
        console.error("Error generando la miniatura:", error);
      });
    } else {
      console.error('El elemento comandaVoucher no está disponible');
    }
  }
  // Método para imprimir la comanda y limpiar la vista
  imprimirComandaGeneral(): void {
    if (!this.pedidosPorMesa || this.pedidosPorMesa.length === 0) {
      console.error('No hay pedidos disponibles para imprimir.');
      Swal.fire('Error', 'No hay pedidos disponibles para imprimir.', 'error');
      return;
    }

    let errores = 0;

    // Itera sobre todos los pedidos y actualiza el estado de cada uno
    this.pedidosPorMesa.forEach((pedido, index) => {
      this.restauranteService.actualizarEstadoPedidoComanda(pedido.id_pedido, false).subscribe({
        next: () => {
          console.log(`Estado actualizado para el pedido ${pedido.id_pedido}`);
          // Solo muestra el mensaje de éxito después de procesar todos los pedidos
          if (index === this.pedidosPorMesa.length - 1 && errores === 0) {
            Swal.fire('Comanda Impresa', 'La comanda ha sido impresa.', 'success').then(() => {
              this.router2.navigate(['/dashboard/show-chef']);
            });
          }
        },
        error: (err) => {
          errores++;
          console.error(`Error al actualizar el estado del pedido ${pedido.id_pedido}:`, err);
          if (index === this.pedidosPorMesa.length - 1) {
            Swal.fire('Error', 'No se pudo actualizar el estado de algunos pedidos.', 'error');
          }
        }
      });
    });
  }

  
  // Método para verificar si hay pedidos
  verificarPedidosYLimpiar(): void {
    if (this.pedidosPorMesa.length === 0) {
      localStorage.setItem('hayComandas', 'false'); // No hay comandos, establecer en localStorage
    } else {
      localStorage.setItem('hayComandas', 'true'); // Hay comandos
    }
  }
  
  abrirOpciones(): void {
    setTimeout(() => {
      this.generarMiniaturaComanda(); // Generar la miniatura después de un ligero retraso
      this.mostrarModalOpciones = true;
    }, 100); // Espera 100 ms para que el DOM se actualice
  }

  cerrarOpciones(): void {
    this.mostrarModalOpciones = false;
    this.comandaMiniatura = null; // Limpiar la miniatura cuando se cierre el modal
  }

  imprimirComanda(): void {
    if (this.comandaVoucher && this.comandaVoucher.nativeElement) {
      const printContents = this.comandaVoucher.nativeElement.innerHTML;
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
  
      document.body.appendChild(iframe);
  
      const doc = iframe.contentWindow?.document;
      doc?.open();
      doc?.write(`
        <html>
          <head>
            <title>Imprimir Comanda</title>
            <style>
              @page {
                size: 80mm auto; /* Define el ancho como el de un recibo */
                margin: 0; /* Sin márgenes */
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                background-color: #ffffff;
              }
              .voucher-container {
                width: 80mm; /* Ancho de recibo estándar */
                padding: 10px;
                box-sizing: border-box;
                text-align: center;
              }
              .voucher-container h3 {
                margin: 5px 0;
                font-size: 16px;
              }
              .voucher-container p {
                margin: 5px 0;
                font-size: 12px;
              }
              .voucher-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              .voucher-table th, .voucher-table td {
                border: 1px solid #000;
                padding: 5px;
                text-align: center;
                font-size: 12px;
              }
              .voucher-table th {
                background-color: #f2f2f2;
              }
              .voucher-total {
                font-weight: bold;
                font-size: 14px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="voucher-container">
              ${printContents}
            </div>
          </body>
        </html>
      `);
      doc?.close();
  
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
  
      // Eliminar el iframe después de imprimir
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
      
      // Llamar a la función para actualizar el estado de los pedidos
      this.imprimirComandaGeneral();
    } else {
      console.error('El elemento comandaVoucher no está disponible');
    }
  }
}
