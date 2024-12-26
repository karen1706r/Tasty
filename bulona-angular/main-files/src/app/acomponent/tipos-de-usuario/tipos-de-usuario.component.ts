import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-tipos-de-usuario',
  templateUrl: './tipos-de-usuario.component.html',
  styleUrls: ['./tipos-de-usuario.component.scss']
})
export class TipodeusuarioComponent implements OnInit {

  public tiposdeusuario: any;

  constructor(
    private ps: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    let pry = this.ps.gettipodeusuario().subscribe(
      {
        next: (data => {
          this.tiposdeusuario = data;
          console.log(data);
        }),
        error: (err => err)
      }
    );
  }




  agregartipodeusuario(): void {
    console.log('Ejecuta el método agregar');
    this.router.navigate(['dashboard/add-tipodeusuario']);
  }

  editartipodeusuario(id: string): void {
    console.log('id_categorias-inventario:' + id + ' Ejecuta el método editar');
    this.router.navigate(['dashboard/update-tipodeusuario/' + id]);
  }
  vertipodeusuario(id: string): void {
    console.log('id:' + id + ' Ejecuta el método ver');
    this.router.navigate(['dashboard/show-tipodeusuario/' + id]);
  }

  borrartipodeusuario(id: string): void {
    Swal.fire({
      title: 'No puedes eliminar un tipo de usuario',
      text: 'Pero puedes editarlo. ¿Quieres ir a editar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Color del botón "Sí"
      cancelButtonColor: '#d33', // Color del botón "No"
      confirmButtonText: 'Sí, ir a editar',
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
    this.router.navigate(['/dashboard/update-tipodeusuario', id]);
  }

}
