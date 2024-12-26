import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Asegúrate de que esta línea esté presente

@Component({
  selector: 'app-add-inventario',
  templateUrl: './add-inventario.component.html',
  styleUrls: ['./add-inventario.component.scss']
})
export class AddInventarioComponent implements OnInit {
  public inventario: FormGroup;
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public ingredientes: any[] = [];
  public categoria_inventario: any[] = [];
  minVencimientoDate: string; // Variable para la fecha mínima de vencimiento

  constructor(
    private formBuilder: FormBuilder,
    private inventarioService: RestauranteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadCategorias();
    this.loadIngredientes();

    // Escuchar cambios en la fecha de ingreso para actualizar la fecha mínima de vencimiento
    this.inventario.get('fecha_ingreso')?.valueChanges.subscribe((fechaIngreso) => {
      this.updateMinVencimientoDate(fechaIngreso);
    });
  }

  private buildForm(): void {
    this.inventario = this.formBuilder.group({
      id_categoria: ['', [Validators.required]],
      id_ingrediente: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Solo números
      fecha_ingreso: ['', [Validators.required]],
      fecha_vencimiento: ['', [Validators.required]]
    }, { validators: this.fechaVencimientoPosterior() });  // Validación personalizada
  }

  private loadCategorias(): void {
    this.inventarioService.getcategorias().subscribe({
        next: (data) => {
            // Filtrar solo las categorías activas
            this.categoria_inventario = data.filter(categoria => categoria.estado === true);
        },
        error: (err) => console.error(err)
    });
}



private loadIngredientes(): void {
  // Cargar todos los ingredientes registrados en el inventario
  this.inventarioService.getinventario().subscribe({
    next: (inventarioData) => {
      // Obtenemos solo los IDs de los ingredientes ya registrados en el inventario
      const ingredientesRegistradosIds = inventarioData.map((item: any) => item.id_ingrediente);

      // Cargar todos los ingredientes
      this.inventarioService.getingredientes().subscribe({
        next: (data) => {
          // Filtrar los ingredientes para mostrar solo los no registrados en el inventario
          this.ingredientes = data.filter((ingrediente: any) => !ingredientesRegistradosIds.includes(ingrediente.id));
        },
        error: (err) => console.error(err)
      });
    },
    error: (err) => console.error(err)
  });
}


  // Actualiza la fecha mínima de vencimiento según la fecha de ingreso seleccionada
  private updateMinVencimientoDate(fechaIngreso: string): void {
    if (fechaIngreso) {
      this.minVencimientoDate = fechaIngreso; // La fecha mínima de vencimiento es igual a la fecha de ingreso
    }
  }

  private fechaVencimientoPosterior() {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fechaIngreso = formGroup.get('fecha_ingreso')?.value;
      const fechaVencimiento = formGroup.get('fecha_vencimiento')?.value;

      if (fechaIngreso && fechaVencimiento && fechaVencimiento < fechaIngreso) {
        return { 'fechaVencimientoInvalida': true }; // Error si la fecha de vencimiento es anterior a la de ingreso
      }
      return null; // No hay error si la fecha de vencimiento es válida
    };
  }

  save(): void {
    if (this.inventario.valid) {
      const formData = this.inventario.value;

      console.log('Datos que se envían:', formData);  // Para verificar los datos antes de enviar

      this.inventarioService.addinventario(formData).subscribe(
        () => {
          this.isSubmitted = true;

          // Mostrar SweetAlert2 con opciones de navegación
          Swal.fire({
            title: '¡Inventario creado!',
            text: 'El inventario fue guardado exitosamente.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ir a inventario',
            cancelButtonText: 'Seguir registrando',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Si selecciona "Ir a inventario"
              this.router.navigate(['/dashboard/inventario']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir registrando", reseteamos el formulario
              this.inventario.reset();
              this.isSubmitted = false;
            }
          });
        },
        (error) => {
          console.error('Error al guardar el inventario:', error);
          let errorMessage = 'Ocurrió un error al guardar el inventario.';
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
      this.inventario.markAllAsTouched(); // Marca todos los campos como "touched" para mostrar errores de validación
    }
  }
}
