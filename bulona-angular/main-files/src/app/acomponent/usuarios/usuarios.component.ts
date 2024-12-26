import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-tipos-de-usuario',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class usuariosComponent implements OnInit {
  public usuarios: any[] = []; // Cambiado a un array
  public tipos_de_usuario: any[] = [];

  constructor(
    private ps: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Primero carga los tipos de usuario
    this.loadTiposusuario(); // Cargar tipos de usuario al iniciar el componente
    this.loadUsuarios(); // Cargar usuarios después de que los tipos de usuario se carguen
  }

  loadUsuarios(): void {
    this.ps.getusuarios().subscribe({
      next: (data) => {
        // Ordenar los usuarios por el campo `nombre_completo` en orden alfabético
        this.usuarios = data.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));
        console.log('Usuarios ordenados:', this.usuarios);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }
  //
  private loadTiposusuario(): void {
    this.ps.gettipodeusuario().subscribe({
      next: (data) => {
        this.tipos_de_usuario = data; // Guardar tipos de usuario
      },
      error: (err) => console.error('Error al cargar tipos de usuario:', err)
    });
  }

  // Busca el tipo de usuario basado en el id
  loadTipousuario(id: number): string {
    if (!this.tipos_de_usuario || !Array.isArray(this.tipos_de_usuario)) {
      return 'Desconocido';
    }

    // Encontrar el tipo de usuario por ID
    const tipousuario = this.tipos_de_usuario.find(tipo => tipo.id === id);

    // Si se encuentra, retorna el nombre, de lo contrario retorna 'Desconocido'
    return tipousuario ? tipousuario.nombre_tipo : 'Desconocido';
  }

  agregarusuarios(): void {
    console.log('Ejecuta el método agregar');
    this.router.navigate(['dashboard/add-usuarios']);
  }

  editarusuarios(id: string): void {
    console.log('id_usuario:' + id + ' Ejecuta el método editar');
    this.router.navigate(['dashboard/update-usuarios/' + id]);
  }

  verusuarios(id: string): void {
    console.log('id:' + id + ' Ejecuta el método ver');
    this.router.navigate(['dashboard/show-usuarios/' + id]);
  }

  borrarusuarios(id: string): void {
    Swal.fire({
      title: 'No puedes eliminar un usuario',
      text: 'Pero puedes deshabilitarlo. ¿Quieres ir a deshabilitar?',
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
    this.router.navigate(['/dashboard/update-usuarios', id]);
  }


  // usuarios.component.ts
  hidePassword(password: string): string {
    return '●'.repeat(password.length); // Reemplaza cada carácter por un punto
  }


}
