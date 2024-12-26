import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-usuarios',
  templateUrl: './delete-usuarios.component.html',
  styleUrls: ['./delete-usuarios.component.scss']
})
export class DeleteusuariosComponent implements OnInit {
  public usuarioId: string; // ID del usuario a eliminar
  public usuario: any; // Almacena los detalles del usuario

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: RestauranteService
  ) { }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id'); // Obtiene el ID del usuario desde la URL
    this.loadUsuarioData(); // Carga los datos del usuario
  }

  private loadUsuarioData(): void {
    this.usuariosService.getusuariosId(this.usuarioId).subscribe(
      (data: any) => {
        this.usuario = data; // Almacena los datos del usuario
      },
      (error) => {
        console.error('Error al cargar datos del usuario:', error);
        alert('Ocurrió un error al cargar los datos del usuario.');
      }
    );
  }

  deleteUsuario(): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuariosService.deleteusuarios(this.usuarioId).subscribe(
        () => {
          alert('Usuario eliminado con éxito.'); // Mensaje de éxito
          this.router.navigate(['/dashboard/usuarios']); // Redirige a la lista de usuarios
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
          alert('Ocurrió un error al eliminar el usuario.'); // Mensaje de error
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/usuarios']); // Redirige si se cancela la eliminación
  }
}
