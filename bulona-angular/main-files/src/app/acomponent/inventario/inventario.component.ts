import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { Subject } from 'rxjs';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  public inventario: any;
  public ingredientes: any[] = [];
  public categoria_inventario: any[] = [];


  constructor(
    private ps: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadInventario();
    this.loadCategorias();    // Carga las categorías cuando se inicia el componente
    this.loadIngredientes();  // Carga los ingredientes cuando se inicia el componente
  }

  private loadInventario(): void {
    this.ps.getinventario().subscribe({
      next: (data) => {
        // Ordenar inventario por categoría y luego por ingrediente alfabéticamente
        this.inventario = data.sort((a, b) => {
          const nombreCategoriaA = this.loadCategoria(a.id_categoria).toLowerCase();
          const nombreCategoriaB = this.loadCategoria(b.id_categoria).toLowerCase();
  
          // Ordenar por categoría primero
          if (nombreCategoriaA !== nombreCategoriaB) {
            return nombreCategoriaA.localeCompare(nombreCategoriaB);
          }
  
          // Si las categorías son iguales, ordenar por nombre de ingrediente
          const nombreIngredienteA = this.loadIngrediente(a.id_ingrediente).toLowerCase();
          const nombreIngredienteB = this.loadIngrediente(b.id_ingrediente).toLowerCase();
          return nombreIngredienteA.localeCompare(nombreIngredienteB);
        });
  
        this.ps.checkInventoryAlerts(this.inventario, this.ingredientes); // Pasar ingredientes también
        console.log(this.inventario);
      },
      error: (err) => console.error(err)
    });
  }

  
  

  // Carga las categorías desde el servicio
  private loadCategorias(): void {
    this.ps.getcategorias().subscribe({
      next: (data) => {
        this.categoria_inventario = data;
      },
      error: (err) => console.error(err)
    });
  }

  // Carga los ingredientes desde el servicio
  private loadIngredientes(): void {
    this.ps.getingredientes().subscribe({
        next: (data) => {
            this.ingredientes = data;
            console.log("Ingredientes cargados:", this.ingredientes);
            this.loadInventario(); // Cargar inventario después de cargar ingredientes
        },
        error: (err) => console.error(err)
    });
}

  // Busca el nombre de la categoría basado en el id
  loadCategoria(id: number): string {
    if (!this.categoria_inventario || !Array.isArray(this.categoria_inventario)) {
      return 'Desconocido';
    }

    const categoria = this.categoria_inventario.find(cat => cat.id === id);
    return categoria ? categoria.nombre_categoria : 'Desconocido';
  }

  // Busca el nombre del ingrediente basado en el id
  loadIngrediente(id: number): string {
    if (!this.ingredientes || !Array.isArray(this.ingredientes)) {
      return 'Desconocido';
    }

    const ingrediente = this.ingredientes.find(ing => ing.id === id);
    return ingrediente ? ingrediente.nombre : 'Desconocido';
  }

  agregarInventario(): void {
    console.log('Ejecuta el método agregar');
    this.router.navigate(['dashboard/add-inventario']);
  }

  editarInventario(id: string): void {
    console.log('id_categorias-inventario:' + id + ' Ejecuta el método editar');
    this.router.navigate(['dashboard/update-inventario/' + id]);
  }
  borrarInventario(id: string): void {
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
        console.log('id:', id, 'Ejecuta el método borrar');
        this.ps.deleteinventario(id).subscribe(() => {
          // Actualizar la lista de inventarios eliminando el seleccionado
          this.inventario = this.inventario.filter(c => c.id !== id);
          
          // Mostrar notificación de éxito
          Swal.fire(
            '¡Eliminado!',
            'El inventario ha sido eliminado con éxito.',
            'success'
          );
        },
        (error) => {
          console.error('Error al eliminar el inventario:', error);
          Swal.fire(
            'Error',
            'Ocurrió un error al eliminar el inventario.',
            'error'
          );
        });
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }
  

  verInventario(id: string): void {
    console.log('id:' + id + ' Ejecuta el método ver');
    this.router.navigate(['dashboard/show-inventario/' + id]);
  }
}
