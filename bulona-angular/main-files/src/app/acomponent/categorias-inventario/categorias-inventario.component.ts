import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-categorias-inventario',
  templateUrl: './categorias-inventario.component.html',
  styleUrls: ['./categorias-inventario.component.scss']
})
export class CategoriasInventarioComponent implements OnInit {

  public categoriasinventario: any;

  constructor(
    private ps: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadCategoriasInventario();
  }

  private loadCategoriasInventario(): void {
    this.ps.getcategoriasinventarios().subscribe({
      next: (data) => {
        // Ordenar las categorías alfabéticamente por el campo `nombre_categoria`
        this.categoriasinventario = data.sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria));
        console.log('Categorías de inventario ordenadas:', this.categoriasinventario);
      },
      error: (err) => console.error('Error al cargar categorías de inventario:', err)
    });
  }
  

  agregarCatInventario(): void {
    console.log('Ejecuta el método agregar');
    this.router.navigate(['dashboard/add-catinventario']);
  }

  editarCatInventario(id: string): void {
    console.log('id_categorias-inventario:' + id + ' Ejecuta el método editar');
    this.router.navigate(['dashboard/update-catinventario/' + id]);
  }

  borrarCatInventario(id: string): void {
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
    this.router.navigate(['/dashboard/update-catinventario', id]);
  }


  verCatInventario(id: string): void {
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
