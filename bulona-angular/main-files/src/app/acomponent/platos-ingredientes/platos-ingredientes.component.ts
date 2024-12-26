import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-platos-ingredientes',
  templateUrl: './platos-ingredientes.component.html',
  styleUrls: ['./platos-ingredientes.component.scss']
})
export class PlatosIngredientesComponent implements OnInit {
  public platosingredientes: any[] = [];
  public ingredientes: any[] = [];
  public platos: any[] = [];
  public groupedPlatos: any[] = [];

  constructor(private ps: RestauranteService, private router: Router) { }

  ngOnInit(): void {
    this.loadPlatos();       // Carga los platos primero
    this.loadIngredientes();  // Luego carga los ingredientes
    this.loadPlatosingredientes(); // Y finalmente los platos ingredientes
  }

  private loadPlatosingredientes(): void {
    this.ps.getplatosingredientes().subscribe({
      next: (data) => {
        this.platosingredientes = data;
        console.log('Platos ingredientes cargados:', this.platosingredientes);
        // Aquí podemos agrupar solo después de haber cargado los platos
        this.groupIngredientsByPlato();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Ocurrió un error al cargar los platos ingredientes.', 'error');
      }
    });
  }

  private groupIngredientsByPlato(): void {
    const grouped: { [key: number]: any } = {};

    this.platosingredientes.forEach(item => {
      const platoId = item.id_plato;
      const ingrediente = { id: item.id_ingredientes, cantidad: item.cantidad };

      if (!grouped[platoId]) {
        const plato = this.platos.find(p => p.id === platoId);
        grouped[platoId] = {
          id: platoId,
          plato: plato ? plato.nombre : 'Desconocido',
          ingredientes: []
        };
      }
      grouped[platoId].ingredientes.push(ingrediente);
    });

    // Convertimos a array, ordenamos ingredientes por nombre en cada plato y luego ordenamos los platos por nombre
    this.groupedPlatos = Object.values(grouped).map((plato: any) => {
      plato.ingredientes.sort((a: any, b: any) => this.loadIngrediente(a.id).localeCompare(this.loadIngrediente(b.id)));
      return plato;
    }).sort((a: any, b: any) => a.plato.localeCompare(b.plato));

    console.log('Platos agrupados y ordenados:', this.groupedPlatos);
  }


  private loadPlatos(): void {
    this.ps.getplatos().subscribe({
      next: (data) => {
        this.platos = data;
        console.log('Platos cargados:', this.platos);
        // Puedes llamar aquí a groupIngredientsByPlato si quieres que se agrupe inmediatamente después de cargar platos
        // Pero debemos asegurarnos de que los platos ingredientes estén también cargados antes
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Ocurrió un error al cargar los platos.', 'error');
      }
    });
  }

  private loadIngredientes(): void {
    this.ps.getingredientes().subscribe({
      next: (data) => {
        this.ingredientes = data;
        console.log('Ingredientes cargados:', this.ingredientes);
        // Si también necesitas hacer algo con los ingredientes, puedes hacerlo aquí
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Ocurrió un error al cargar los ingredientes.', 'error');
      }
    });
  }

  loadPlato(id: number): string {
    if (!id) {
      return 'Desconocido';
    }

    const plato = this.platos.find(p => p.id === id);
    return plato ? plato.nombre : 'Desconocido';
  }

  loadIngrediente(id: number): string {
    if (!id) {
      return 'Desconocido';
    }

    const ingrediente = this.ingredientes.find(ing => ing.id === id);
    return ingrediente ? ingrediente.nombre : 'Desconocido';
  }

  agregarPlatosingredientes(): void {
    this.router.navigate(['dashboard/add-platos-ingredientes']);
  }

  editarPlatosingredientes(id: string): void {
    this.router.navigate(['dashboard/update-platos-ingredientes/' + id]);
  }

  borrarPlatosingredientes(id: string): void {
    // Usar SweetAlert2 para la confirmación
    Swal.fire({
      title: 'Te recomiendo no eliminar todos los ingredientes',
      text: 'Pero si editarlos. ¿Quieres ir a editar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Color del botón "Sí"
      cancelButtonColor: '#d33', // Color del botón "No"
      confirmButtonText: 'Sí, ir a editar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirigir a la página de deshabilitar (implementa este método según tu lógica)
        this.irAEditar(id);
      } else {
        console.log('Deshabilitación cancelada');
      }
    });
  }

  irAEditar(id: string): void {
    // Aquí puedes agregar la lógica para redirigir a la página de deshabilitar
    this.router.navigate(['/dashboard/update-platos-ingredientes', id]);
  }

  verPlatosingredientes(id: string): void {
    this.router.navigate(['dashboard/show-platos-ingredientes/' + id]);
  }
}
