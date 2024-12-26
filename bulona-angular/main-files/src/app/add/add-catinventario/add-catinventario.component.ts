import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';  // Importar SweetAlert2

@Component({
  selector: 'app-add-catinventario',
  templateUrl: './add-catinventario.component.html',
  styleUrls: ['./add-catinventario.component.scss']
})
export class AddCatinventarioComponent implements OnInit {
  public catinventario: FormGroup;
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private catinventarioService: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.catinventario = this.formBuilder.group({
      nombre_categoria: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑ ]*$')]],
      estado: [false]
    });
  }

  save(): void {
    if (this.catinventario.valid) {
      const formData = this.catinventario.value;
      console.log('Form is valid. Data:', formData);

      this.catinventarioService.addcategoriasinventario(formData).subscribe(
        () => {
          this.isSubmitted = true;
          this.isSaving = false;

          // Mostrar SweetAlert2 con dos opciones: ir a la lista o seguir registrando
          Swal.fire({
            title: '¡Categoría creada!',
            text: 'La categoría fue guardada exitosamente.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ir a categorías',
            cancelButtonText: 'Seguir registrando',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Si selecciona "Ir a categorías"
              this.router.navigate(['/dashboard/categorias-inventario']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir registrando", reseteamos el formulario
              this.catinventario.reset();
              this.isSubmitted = false;
            }
          });
        },
        (error) => {
          console.error('Error al guardar la categoría:', error);
          let errorMessage = 'Ocurrió un error al guardar la categoría.';
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
      this.catinventario.markAllAsTouched();
    }
  }
}