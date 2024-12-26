import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PedidoDetalle {
  nombre: string;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit, AfterViewInit {
  @ViewChild('factura') facturaElement!: ElementRef;
  @ViewChild('reciboVoucher') reciboVoucher!: ElementRef;
  idMesa: number = 0;
  numeroMesa: string = '';
  fecha_hora: Date = new Date();
  pedidos_por_mesa: PedidoDetalle[] = [];
  totalFactura: number = 0;
  pedidosIds: number[] = [];
  mostrarModalOpciones: boolean = false;
  mostrarModalCorreo: boolean = false;
  correoDestino: string = '';
  facturaMiniatura: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private restauranteService: RestauranteService
  ) { }

  ngOnInit(): void {
    this.idMesa = +this.route.snapshot.paramMap.get('idMesa')!;
    this.cargarNumeroMesa();
    this.cargarDetallesPedido();
  }

  ngAfterViewInit(): void {
    this.generarMiniaturaFactura();
  }

  cargarNumeroMesa(): void {
    this.restauranteService.getMesasById(this.idMesa).subscribe(
      (data) => {
        this.numeroMesa = data.numero;
      },
      (error) => {
        console.error('Error al cargar el número de la mesa:', error);
      }
    );
  }

  cargarDetallesPedido(): void {
    this.restauranteService.obtenerPedidosPorMesafactura(this.idMesa.toString()).subscribe(
      (pedidosMesa) => {
        const pedidosActivos = pedidosMesa.filter((pedido: any) => pedido.estado_pedido === true);

        if (pedidosActivos.length > 0) {
          this.fecha_hora = new Date(pedidosActivos[0].fecha);
          this.pedidosIds = pedidosActivos.map((pedido: any) => pedido.id);

          this.pedidos_por_mesa = pedidosActivos.flatMap((pedido: any) =>
            pedido.pedidos_por_mesa_models.map((detalle: any) => ({
              nombre: detalle.platos_model.nombre,
              cantidad: detalle.cantidad,
              precio: detalle.platos_model.precio || 0
            }))
          );

          this.calcularTotalFactura();
        } else {
          console.log('No hay pedidos activos para esta mesa.');
        }
      },
      (error) => {
        console.error('Error al cargar detalles del pedido:', error);
      }
    );
  }

  calcularTotalFactura(): void {
    this.totalFactura = this.pedidos_por_mesa.reduce((total, detalle) => {
      return total + (detalle.precio * detalle.cantidad);
    }, 0);
  }

  pagarFactura(): void {
    const factura = {
      numero: this.numeroMesa,
      total: this.totalFactura,
      fecha: new Date(),
      id_pedido: this.pedidosIds[0] || null
    };

    this.restauranteService.guardarFactura(factura).subscribe(
      (responseFactura) => {
        Swal.fire({
          icon: 'success',
          title: '¡Factura pagada!',
          text: `La factura con un total de $ ${this.totalFactura} ha sido guardada.`,
          confirmButtonText: 'Aceptar'
        });

        const desactivacionObservables = this.pedidosIds.map((idPedido: number) =>
          this.restauranteService.desactivarPedido(idPedido)
        );

        forkJoin(desactivacionObservables).subscribe(
          () => {
            console.log("Todos los pedidos han sido desactivados.");
            this.router.navigate(['dashboard/show-cajero']);
          },
          (errorEstado) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar el estado de los pedidos.',
            });
            console.error('Error al actualizar el estado de los pedidos:', errorEstado);
          }
        );
      },
      (errorFactura) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al intentar guardar la factura.',
        });
        console.error('Error al guardar la factura:', errorFactura);
      }
    );
  }

  abrirOpciones(): void {
    setTimeout(() => {
      this.generarMiniaturaFactura();
      this.mostrarModalOpciones = true;
    }, 100);
  }

  cerrarOpciones(): void {
    this.mostrarModalOpciones = false;
    this.facturaMiniatura = null;
  }

  generarMiniaturaFactura(): void {
    if (this.reciboVoucher && this.reciboVoucher.nativeElement) {
      html2canvas(this.reciboVoucher.nativeElement).then(canvas => {
        this.facturaMiniatura = canvas.toDataURL('image/png');
        this.cdr.detectChanges();
        console.log("Miniatura generada con éxito:", this.facturaMiniatura);
      }).catch(error => {
        console.error("Error generando la miniatura:", error);
      });
    } else {
      console.error('El elemento reciboVoucher no está disponible');
    }
  }

  imprimirFactura(): void {
    if (this.reciboVoucher && this.reciboVoucher.nativeElement) {
      const printContents = this.reciboVoucher.nativeElement.innerHTML;
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
            <title>Imprimir Factura</title>
            <style>
              @page {
                size: 80mm auto;
                margin: 0;
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
                width: 80mm;
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

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    } else {
      console.error('El elemento reciboVoucher no está disponible');
    }
  }

  enviarPorCorreo(): void {
    this.mostrarModalOpciones = false;
    this.mostrarModalCorreo = true;
  }

  cerrarModalCorreo(): void {
    this.mostrarModalCorreo = false;
    this.correoDestino = '';
  }

  // Método para validar el formato del correo
  esCorreoValido(correo: string): boolean {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return correoRegex.test(correo);
  }

  confirmarEnvioCorreo(): void {
    if (this.correoDestino) {
      this.generarPDF().then(pdfBlob => {
        const formData = new FormData();
        formData.append('email', this.correoDestino);
        formData.append('pdf', pdfBlob, `Factura_Mesa_${this.numeroMesa}.pdf`);

        this.restauranteService.enviarFacturaPorCorreo(formData).subscribe(
          response => {
            Swal.fire('Enviado', 'La factura ha sido enviada por correo.', 'success');
            this.cerrarModalCorreo(); // Cierra el modal después de enviar
          },
          error => {
            console.error('Error enviando factura:', error);
            Swal.fire('Error', 'No se pudo enviar la factura. Inténtalo nuevamente.', 'error');
          }
        );
      });
    } else {
      Swal.fire('Error', 'Por favor ingresa un correo válido.', 'error');
    }
  }


  generarPDF(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      html2canvas(this.reciboVoucher.nativeElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 10, 10, canvas.width / 4, canvas.height / 4);
        resolve(pdf.output('blob'));
      }).catch(reject);
    });
  }
}
