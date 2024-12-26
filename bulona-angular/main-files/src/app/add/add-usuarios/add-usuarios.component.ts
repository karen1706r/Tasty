import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';  // Importar SweetAlert2

@Component({
  selector: 'app-add-usuarios',
  templateUrl: './add-usuarios.component.html',
  styleUrls: ['./add-usuarios.component.scss']
})
export class AddusuariosComponent implements OnInit {
  public usuarios: FormGroup;  // Formulario reactivo
  public isSubmitted: boolean = false;  // Bandera para indicar si el formulario ha sido enviado
  public isSaving: boolean = false;  // Bandera para indicar si se está guardando
  public tipos_de_usuario: any[] = []; // Array para almacenar tipos de usuario
  public isPasswordVisible: boolean = false; // Bandera para la visibilidad de la contraseña


  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: RestauranteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();  // Construir el formulario al inicializar
    this.loadTiposusuario(); // Cargar tipos de usuario al iniciar
  }

  private buildForm(): void {
    this.usuarios = this.formBuilder.group({
      nombre_completo: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], // Solo letras y espacios
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Solo números
      contrasena: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6}$')]], // Letras y números, exactamente 6 caracteres
      correo: ['', [Validators.required, Validators.email]], // Validación para el correo
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Solo números y exactamente 10 dígitos
      direccion: ['', [Validators.required]], // Solo se asegura que el campo no esté vacío
      id_tipo_usuario: ['', [Validators.required]] // Asegúrate de incluir la validación para id_tipo_usuario
    });
  }

  private loadTiposusuario(): void {
    this.usuariosService.gettipodeusuario().subscribe({
      next: (data) => {
        this.tipos_de_usuario = data; // Guardar tipos de usuario
        console.log('Tipos de usuario:', this.tipos_de_usuario); // Para depuración
      },
      error: (err) => console.error('Error al cargar tipos de usuario:', err)
    });
  }

  save(): void {
    if (this.usuarios.valid) {
      const formData = this.usuarios.value;  // Obtener datos del formulario
      this.usuariosService.addusuarios(formData).subscribe(
        () => {
          this.isSubmitted = true;  // Marcar el formulario como enviado
          // Mostrar SweetAlert2 con opciones
          Swal.fire({
            title: '¡Usuario Creado!',
            text: 'El usuario fue guardado exitosamente.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ir a usuarios',
            cancelButtonText: 'Seguir registrando',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Si selecciona "Ir a usuarios"
              this.router.navigate(['/dashboard/usuarios']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir registrando", reseteamos el formulario
              this.usuarios.reset();
              this.isSubmitted = false;  // Restablecer estado de envío
            }
          });
        },
        (error) => {
          console.error('Error al guardar el usuario:', error);
          let errorMessage = 'Ocurrió un error al guardar el usuario.';  // Mensaje de error por defecto
          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;  // Mensaje de error específico
          }

          // Mostrar alerta de error
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      console.log('Form is invalid');
      this.usuarios.markAllAsTouched();  // Marca todos los campos como "touched" para mostrar errores de validación
    }
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible; // Alternar visibilidad de la contraseña
  }

}
