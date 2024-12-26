import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-catplato',
  templateUrl: './add-catplato.component.html',
  styleUrls: ['./add-catplato.component.scss']
})
export class AddCatplatosComponent implements OnInit {
  public catplatos: FormGroup;
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public existingCategories: string[] = []; // Lista de categorías existentes

  constructor(
    private formBuilder: FormBuilder,
    private catplatosService: RestauranteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadExistingCategories();
  }

  private buildForm(): void {
    this.catplatos = this.formBuilder.group({
      nombre_categoria: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑ ]*$')]], // Solo letras y espacios, incluyendo ñ y Ñ
      estado: [false] // Checkbox o campo booleano
    });
  }

  private loadExistingCategories(): void {
    // Obtener todas las categorías existentes desde el servicio
    this.catplatosService.getcategoriasplatos().subscribe({
      next: (data) => {
        this.existingCategories = data.map((cat: any) => cat.nombre_categoria.toLowerCase());
      },
      error: (err) => {
        console.error('Error al cargar las categorías existentes:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las categorías existentes.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  save(): void {
    if (this.catplatos.valid) {
      const formData = this.catplatos.value;

      // Validar si el nombre de la categoría ya existe (insensible a mayúsculas)
      if (this.existingCategories.includes(formData.nombre_categoria.toLowerCase())) {
        Swal.fire({
          title: 'Nombre duplicado',
          text: 'El nombre de la categoría ya existe. Por favor, elige otro.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      this.isSaving = true;
      this.catplatosService.addcategoriasplatos(formData).subscribe(
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
              this.router.navigate(['/dashboard/categorias-platos']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.catplatos.reset();
              this.isSubmitted = false;
            }
          });
        },
        (error) => {
          this.isSaving = false;
          console.error('Error al guardar la categoría:', error);
          let errorMessage = 'Ocurrió un error al guardar la categoría.';
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
      console.log('Form is invalid');
      this.catplatos.markAllAsTouched();
    }
  }
}