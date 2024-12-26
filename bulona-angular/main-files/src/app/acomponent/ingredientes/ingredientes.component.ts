import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-ingredientes',
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.scss']
})
export class IngredientesComponent implements OnInit {

  public ingredientes: any;

  constructor(
    private ps: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadIngredientes();
  }

  private loadIngredientes(): void {
    this.ps.getingredientes().subscribe({
      next: (data) => {
        // Ordenar ingredientes por nombre en orden alfabético
        this.ingredientes = data.sort((a: any, b: any) => {
          const nombreA = a.nombre.toLowerCase();
          const nombreB = b.nombre.toLowerCase();
          return nombreA.localeCompare(nombreB);
        });
        console.log(this.ingredientes);
      },
      error: (err) => console.error(err)
    });
  }

  agregarIngredientes(): void {
    console.log('Ejecuta el método agregar');
    this.router.navigate(['dashboard/add-ingredientes']);
  }

  editarIngredientes(id: string): void {
    console.log('id_categorias-inventario:' + id + ' Ejecuta el método editar');
    this.router.navigate(['dashboard/update-ingredientes/' + id]);
  }

  borrarIngredientes(id: string): void {
    Swal.fire({
      title: 'No puedes eliminar una categoría',
      text: 'Pero puedes deshabilitarla. ¿Quieres ir a deshabilitar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Color del botón "Sí"
      cancelButtonColor: '#d33', // Color del botón "No"
      confirmButtonText: 'Sí, ir a deshabilitar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirigir a la página de deshabilitar (implementa este método según tu lógica)
        this.irADeshabilitar(id);
      } else {
        console.log('Deshabilitación cancelada');
      }
    });
  }

  irADeshabilitar(id: string): void {
    // Aquí puedes agregar la lógica para redirigir a la página de deshabilitar
    this.router.navigate(['/dashboard/update-catplato', id]);
  }
  

  verIngredientes(id: string): void {
    console.log('id:' + id + ' Ejecuta el método ver');
    this.router.navigate(['dashboard/show-ingredientes/' + id]);
  }
}
