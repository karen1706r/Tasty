import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-tipodeusuario',
  templateUrl: './update-tipodeusuario.component.html',
  styleUrls: ['./update-tipodeusuario.component.scss']
})
export class UpdatetipodeusuarioComponent implements OnInit {

  public tipodeusuario: FormGroup;
  public tipodeusuarioId: string;
  public isSuccess = false;  // Bandera para indicar éxito en la operación
  public isSubmitted = false; // Bandera para mostrar alerta de éxito

  constructor(
    private formBuilder: FormBuilder,
    private tipodeusuarioService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.tipodeusuarioId = this.route.snapshot.paramMap.get('id');
    console.log('ID del registro a editar:', this.tipodeusuarioId); // Verificar el ID
    this.loadtipodeusuarioData();
  }

  private buildForm(): void {
    this.tipodeusuario = this.formBuilder.group({
      nombre_tipo: ['', [Validators.required, Validators.minLength(4)]] // Campo para editar
    });
  }

  private loadtipodeusuarioData(): void {
    this.tipodeusuarioService.gettipodeusuarioId(this.tipodeusuarioId).subscribe(
      (data: any) => {

        // Verifica que el campo exista en la respuesta
        if (data && data.nombre_tipo) {
          this.tipodeusuario.patchValue({
            nombre_tipo: data.nombre_tipo // Cargar el nombre de la categoría
          });
        } else {
          console.error('No se encontraron datos para la categoría con ID:', this.tipodeusuarioId);
          alert('No se encontraron datos para la categoría.');
        }
      },
      (error) => {
        console.error('Error al cargar datos de la categoría:', error);
        alert('Ocurrió un error al cargar datos de la categoría.');
      }
    );
  }

  save(): void {
    this.tipodeusuario.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores de validación

    if (this.tipodeusuario.valid) {
      this.tipodeusuarioService.edittipodeusuario(this.tipodeusuario.value, this.tipodeusuarioId).subscribe(
        () => {
          this.isSuccess = true; // Activar la bandera isSuccess
          this.isSubmitted = true; // Activar la bandera isSubmitted para mostrar la alerta
          Swal.fire({
            title: '¡Éxito!',
            text: 'El tipo de usuario fue actualizado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            window.location.href = '/dashboard/tipos_de_usuario'; // Redirigir a la página de tipos de usuario
          });
        },
        (error) => {
          console.error('Error al actualizar la categoría:', error);
          let errorMessage = 'Ocurrió un error al actualizar la categoría.';
          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          Swal.fire({
            title: 'Error',
            text: errorMessage,
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


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

