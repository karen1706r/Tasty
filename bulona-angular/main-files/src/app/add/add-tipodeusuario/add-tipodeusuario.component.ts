import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';  // Importar SweetAlert2

@Component({
  selector: 'app-add-tipodeusuario',
  templateUrl: './add-tipodeusuario.component.html',
  styleUrls: ['./add-tipodeusuario.component.scss']
})
export class AddtipodeusuarioComponent implements OnInit {
  public tipodeusuario: FormGroup;  // Formulario reactivo
  public isSubmitted: boolean = false;  // Bandera para indicar si el formulario ha sido enviado
  public isSaving: boolean = false;  // Bandera para indicar si se está guardando
  public reservation: any[];  // Reservas obtenidas

  constructor(
    private formBuilder: FormBuilder,
    private tipodeusuarioService: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildForm();  // Construir el formulario al inicializar
    this.loadReservation();  // Cargar la lista de tipos de usuario
  }

  private buildForm(): void {
    this.tipodeusuario = this.formBuilder.group({
      nombre_tipo: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],  // Solo letras y espacios
    });
  }

  loadReservation(): void {
    this.tipodeusuarioService.gettipodeusuario().subscribe(
      data => {
        console.log('Reservation data:', data);
        this.reservation = data;  // Asignar la data obtenida
      },
      error => {
        console.error('Error fetching reservation', error);
      });
  }

  save(): void {
    if (this.tipodeusuario.valid) {
      const formData = this.tipodeusuario.value;  // Obtener datos del formulario
      console.log('Form is valid. Data:', formData);

      this.tipodeusuarioService.addtipodeusuario(formData).subscribe(
        () => {
          this.isSubmitted = true;  // Marcar el formulario como enviado
          this.isSaving = false;  // Cambiar estado de guardado

          // Mostrar SweetAlert2 con opciones
          Swal.fire({
            title: '¡Tipo de Usuario Creado!',
            text: 'El tipo de usuario fue guardado exitosamente.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ir a tipos de usuario',
            cancelButtonText: 'Seguir registrando',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Si selecciona "Ir a tipos de usuario"
              this.router.navigate(['/dashboard/tipos_de_usuario']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir registrando", reseteamos el formulario
              this.tipodeusuario.reset();
              this.isSubmitted = false;  // Restablecer estado de envío
            }
          });
        },
        (error) => {
          console.error('Error al guardar registro:', error);
          let errorMessage = 'Ocurrió un error al registro de usuario.';  // Mensaje de error por defecto
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
      if (this.tipodeusuario) {
        this.tipodeusuario.markAllAsTouched();  // Marca todos los campos como "touched" para mostrar errores de validación
      } else {
        console.error('tipo-de-usuario is null');
      }
    }
  }
}
