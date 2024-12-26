import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.scss']
})
export class MesasComponent implements OnInit {
  public mesas: any[] = []; // Inicializa como un array vacío
  public isCursorEffectVisible: boolean = false; // Para controlar la visibilidad del efecto de cursor
  public cursorPosition = { x: 0, y: 0 }; // Para almacenar la posición del cursor

  constructor(
    private ps: RestauranteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadMesas();
  }

  private loadMesas(): void {
    this.ps.getMesas().subscribe(
      {
        next: (data) => {
          this.mesas = data; // Asegúrate de que 'data' sea un array
          console.log(data);
        },
        error: (err) => console.error(err)
      }
    );
  }

  agregarmesas(): void {
    console.log('Ejecuta el método agregar');
    this.router.navigate(['dashboard/add-mesas']);
  }

  editarmesas(id: string): void {
    console.log('id:' + id + ' Ejecuta el método editar');
    this.router.navigate(['dashboard/update-mesas/' + id]);
  }

  borrarmesas(id: string): void {
    // Usar SweetAlert2 para la confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, ejecuta el borrado
        this.ps.deleteMesas(id).subscribe(
          () => {
            // Actualizar la lista de mesas eliminando la seleccionada
            this.mesas = this.mesas.filter(c => c.id !== id);

            // Mostrar notificación de éxito
            Swal.fire(
              '¡Eliminado!',
              'La mesa ha sido eliminada con éxito.',
              'success'
            );
          },
          (error) => {
            console.error('Error al eliminar la mesa:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la mesa.',
              'error'
            );
          }
        );
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }

  vermesas(id: string): void {
    console.log('id:' + id + ' Ejecuta el método ver');
    this.router.navigate(['dashboard/show-categorias-inventario/' + id]);
  }

  private convertirEstado(valor: any): boolean {
    if (typeof valor === 'string') {
      return valor.toLowerCase() === 'true';
    }
    return !!valor;
  }
}
