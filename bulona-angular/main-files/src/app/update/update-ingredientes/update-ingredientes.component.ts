import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-ingredientes',
  templateUrl: './update-ingredientes.component.html',
  styleUrls: ['./update-ingredientes.component.scss']
})
export class UpdateIngredientesComponent implements OnInit {
  public ingredientes: FormGroup;
  public ingredientesId: string;
  public originalData: any;
  public isSaving = false;

  constructor(
    private formBuilder: FormBuilder,
    private ingredientesService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.ingredientesId = this.route.snapshot.paramMap.get('id')!;
    this.loadIngredientesData();
  }

  private buildForm(): void {
    this.ingredientes = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      unidad: ['', [Validators.required]]
    });
  }

  private loadIngredientesData(): void {
    this.ingredientesService.getingredientesId(this.ingredientesId).subscribe(
      (data: any) => {
        if (data && data.nombre && data.unidad) {
          this.ingredientes.patchValue({
            nombre: data.nombre,
            unidad: data.unidad
          });
          this.originalData = { nombre: data.nombre, unidad: data.unidad };
          this.ingredientes.updateValueAndValidity(); // sincroniza el formulario
        } else {
          console.error('No se encontraron datos para el ingrediente con ID:', this.ingredientesId);
          alert('No se encontraron datos para el ingrediente.');
        }
      },
      (error) => {
        console.error('Error al cargar datos del ingrediente:', error);
        alert('Ocurrió un error al cargar datos del ingrediente.');
      }
    );
  }

  save(): void {
    // Marca todos los campos como tocados para mostrar los mensajes de error
    this.ingredientes.markAllAsTouched();

    // Verifica si el formulario es válido
    if (this.ingredientes.valid) {
      // Lógica para permitir actualización aunque no se cambie el valor
      if (JSON.stringify(this.ingredientes.value) === JSON.stringify(this.originalData)) {
        Swal.fire({
          title: 'Sin cambios detectados',
          text: 'No has realizado cambios en los datos. Pero puedes actualizar sin modificar la cantidad.',
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
      }

      this.isSaving = true; // Indica que se está guardando

      this.ingredientesService.editingredientes(this.ingredientes.value, this.ingredientesId).subscribe(
        () => {
          this.isSaving = false; // Desactiva el estado de guardado
          Swal.fire({
            title: '¡Ingrediente actualizado!',
            text: 'El ingrediente fue actualizado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/dashboard/ingredientes']);
            } else {
              this.ingredientes.reset();
            }
          });
        },
        (error) => {
          this.isSaving = false; // Desactiva el estado de guardado si hay un error
          console.error('Error al actualizar el ingrediente:', error);
          let errorMessage = 'Ocurrió un error al actualizar el ingrediente.';
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
    }
  }

}
