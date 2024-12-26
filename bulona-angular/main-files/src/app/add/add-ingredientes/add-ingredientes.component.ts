import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Asegúrate de que esta línea esté presente

@Component({
  selector: 'app-add-ingredientes',
  templateUrl: './add-ingredientes.component.html',
  styleUrls: ['./add-ingredientes.component.scss']
})
export class AddIngredientesComponent implements OnInit {
  public ingredientes: FormGroup;
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private ingredientesService: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.ingredientes = this.formBuilder.group({
      nombre: ['', [Validators.required]], // Aceptar letras y espacios, incluyendo ñ y acentos
      unidad: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Solo números
    });
  }

  save(): void {
    if (this.ingredientes.valid) {
      const formData = this.ingredientes.value;
      console.log('Form is valid. Data:', formData);

      this.ingredientesService.addingredientes(formData).subscribe(
        () => {
          this.isSubmitted = true;
          this.isSaving = false;

          // Mostrar SweetAlert2 con opciones de navegación
          Swal.fire({
            title: '¡Ingrediente creado!',
            text: 'El ingrediente fue guardado exitosamente.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ir a ingredientes',
            cancelButtonText: 'Seguir registrando',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Si selecciona "Ir a ingredientes"
              this.router.navigate(['/dashboard/ingredientes']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir registrando", reseteamos el formulario
              this.ingredientes.reset();
              this.isSubmitted = false;
            }
          });
        },
        (error) => {
          console.error('Error al guardar el ingrediente:', error);
          let errorMessage = 'Ocurrió un error al guardar el ingrediente.';
          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          // Mostrar SweetAlert2 cuando hay un error
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
      if (this.ingredientes) {
        this.ingredientes.markAllAsTouched(); // Marca todos los campos como "touched" para mostrar errores de validación
      } else {
        console.error('ingredientes is null');
      }
    }
  }
}
