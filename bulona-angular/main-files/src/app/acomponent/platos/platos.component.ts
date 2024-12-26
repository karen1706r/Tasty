import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
    selector: 'app-platos',
    templateUrl: './platos.component.html',
    styleUrls: ['./platos.component.scss']
})
export class PlatosComponent implements OnInit {

    public platos: any[] = [];
    public categoriasPlatos: any[] = []; // Arreglo para almacenar las categorías de los platos
    private baseImageUrl: string = 'http://localhost:3013/'; // Base URL del servidor
    id: string;

    constructor(
        private ps: RestauranteService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.ps.getplatos().subscribe({
            next: (platosData) => {
                this.platos = platosData.map(plato => ({
                    ...plato,
                    ruta: plato.ruta ? this.baseImageUrl + plato.ruta : null // Asigna la ruta completa de la imagen
                }));
                console.log('Platos:', this.platos);
    
                const categoriaObservables = this.platos.map((plato: any) =>
                    this.ps.getCategoriaPlatoById(plato.id_categoria)
                );
    
                forkJoin(categoriaObservables).subscribe({
                    next: (categoriasData) => {
                        this.platos.forEach((plato, index) => {
                            plato.nombre_categoria = categoriasData[index].nombre_categoria;
                        });
    
                        // Ordenar los platos alfabéticamente por el nombre
                        this.platos.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()));
    
                        console.log('Platos con categorías ordenados:', this.platos);
                    },
                    error: (err) => console.error('Error al obtener las categorías:', err)
                });
            },
            error: (err) => console.error('Error al obtener los platos:', err)
        });
    }

    agregarplatos(): void {
        console.log('Ejecuta el método agregar');
        this.router.navigate(['dashboard/add-plato']);
    }

    editarplatos(id: string): void {
        console.log('id_categorias-platos:' + id + ' Ejecuta el método editar');
        this.router.navigate(['dashboard/update-plato/' + id]);
    }

    borrarplatos(id: string): void {
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
                this.ps.deleteplatos(id).subscribe(
                    () => {
                        // Actualizar la lista de platos eliminando el seleccionado
                        this.platos = this.platos.filter(c => c.id !== id);

                        // Mostrar notificación de éxito
                        Swal.fire(
                            '¡Eliminado!',
                            'El plato ha sido eliminado con éxito.',
                            'success'
                        );
                    },
                    (error) => {
                        console.error('Error al eliminar el plato:', error);
                        Swal.fire(
                            'Error',
                            'Ocurrió un error al eliminar el plato.',
                            'error'
                        );
                    }
                );
            } else {
                console.log('Eliminación cancelada');
            }
        });
    }


    verplatos(id: string): void {
        console.log('id:' + id + ' Ejecuta el método ver');
        this.router.navigate(['dashboard/show-plato/' + id]);
    }
}
