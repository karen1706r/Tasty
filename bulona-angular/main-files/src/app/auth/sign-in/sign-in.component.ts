import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm: FormGroup;
  isPasswordVisible: boolean = false; // Inicializa la variable para la visibilidad de la contraseña

  constructor(
    private fb: FormBuilder,
    private restauranteService: RestauranteService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const { correo, contrasena } = this.signInForm.value;

      console.log('Iniciando sesión con:', { correo, contrasena });

      // Llamar al servicio de login
      this.restauranteService.login(correo, contrasena).subscribe(
        (response: any[]) => {
          console.log('Respuesta del servidor al iniciar sesión:', response);

          // Buscar el usuario correspondiente a las credenciales ingresadas
          const usuario = response.find((usr) => usr.correo === correo && usr.contrasena === contrasena);

          console.log('Usuario encontrado:', usuario);

          if (usuario) {
            const usuarioId = usuario.id;
            const userRoleId = usuario.id_tipo_usuario;

            // Almacenar el ID del usuario y el rol en el localStorage
            localStorage.setItem('userId', usuarioId.toString());
            localStorage.setItem('userRoleId', userRoleId.toString());

            // Obteniendo la fecha y hora actuales
            const hora = new Date();

            const sesionData = {
              id_usuario: usuarioId,
              hora: hora
            };

            console.log('Datos de la sesión a guardar:', sesionData);

            // Guardar la sesión en el servidor
            this.restauranteService.addsesiones(sesionData).subscribe(
              (sesionResponse) => {
                console.log('Sesión guardada en el servidor:', sesionResponse);

                // Guardar el sessionId en localStorage
                if (sesionResponse && sesionResponse.id) {
                  try {
                    localStorage.setItem('sessionId', sesionResponse.id.toString());
                    console.log('sessionId guardado en localStorage:', localStorage.getItem('sessionId'));
                  } catch (e) {
                    console.error('Error al intentar guardar el sessionId en localStorage:', e);
                  }
                } else {
                  console.warn('No se recibió un sessionId en la respuesta al guardar la sesión');
                }

                // Notificar al usuario sobre el éxito del inicio de sesión
                Swal.fire('Éxito', 'Has iniciado sesión correctamente y la sesión ha sido registrada', 'success');

                // Redirigir al usuario según su rol
                this.redirectUser(userRoleId);
              },
              (sesionError) => {
                console.error('Error al guardar la sesión:', sesionError);
                Swal.fire('Error', 'Iniciaste sesión, pero ocurrió un error al guardar la sesión', 'warning');
              }
            );
          } else {
            // Usuario no encontrado con las credenciales proporcionadas
            Swal.fire('Error', 'Credenciales incorrectas', 'error');
          }
        },
        (error) => {
          console.error('Error en el inicio de sesión:', error);
          Swal.fire('Error', `Ocurrió un error: ${error.message}`, 'error');
        }
      );
    } else {
      console.log('Formulario no válido');
      Swal.fire('Error', 'Por favor completa el formulario correctamente', 'error');
    
    }
    this.restauranteService.getPedidoId()
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible; // Alterna la visibilidad de la contraseña
  }

  // Redirigir según el rol del usuario
  redirectUser(userRoleId: number) {
    switch (userRoleId) {
      case 1: // Administrador
        this.router.navigate(['/dashboard/Predicciones']);
        break;
      case 2: // Mesero
        this.router.navigate(['/dashboard/show-mesero']);
        break;
      case 4: // Chef
        this.router.navigate(['/dashboard/show-preparaciones']);
        break;
      case 5: // Cajero
        this.router.navigate(['/dashboard/show-cajero']);
        break;
      default:
        this.router.navigate(['/sign-in']);
    }
  }
}
