// update-usuarios.component.ts
import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-usuarios',
  templateUrl: './update-usuarios.component.html',
  styleUrls: ['./update-usuarios.component.scss']
})
export class UpdateusuarioComponent implements OnInit {
  public usuario: FormGroup;
  public usuarioId: string;
  public isSuccess = false;  
  public isSubmitted = false; 
  public tipos_de_usuario: any[] = []; 
  public isPasswordVisible = false; 

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    this.loadusuarioData();
    this.loadTiposusuario(); 
  }

  private buildForm(): void {
    this.usuario = this.formBuilder.group({
      nombre_completo: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      contrasena: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6}$')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccion: ['', [Validators.required]],
      id_tipo_usuario: ['', [Validators.required]]
    });
  }

  private loadusuarioData(): void {
    this.usuariosService.getusuariosId(this.usuarioId).subscribe(
      (data: any) => {
        this.usuario.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos del usuario:', error);
        alert('Ocurrió un error al cargar datos del usuario.');
      }
    );
  }

  private loadTiposusuario(): void {
    this.usuariosService.gettipodeusuario().subscribe({
      next: (data) => {
        this.tipos_de_usuario = data;
      },
      error: (err) => console.error('Error al cargar tipos de usuario:', err)
    });
  }

  save(): void {
    this.isSubmitted = true; 
    // Marca todos los campos como tocados para mostrar errores de validación
    this.usuario.markAllAsTouched();

    if (this.usuario.valid) {
      this.usuariosService.editusuarios(this.usuario.value, this.usuarioId).subscribe(
        () => {
          this.isSuccess = true; 
          Swal.fire({
            title: '¡Éxito!',
            text: 'El usuario fue actualizado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/dashboard/usuarios']); // Redirigir después de un corto tiempo
          });
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar el usuario.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
}


  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible; 
  }
}
