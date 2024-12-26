import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-update-inventario',
  templateUrl: './update-inventario.component.html',
  styleUrls: ['./update-inventario.component.scss']
})
export class UpdateInventarioComponent implements OnInit {
  public inventario: FormGroup;
  public isSubmitted: boolean = false;
  public minDate: string;
  public ingredientes: any[] = [];
  public categoria_inventario: any[] = [];
  minVencimientoDate: string; // Variable para la fecha mínima de vencimiento


  constructor(
    private formBuilder: FormBuilder,
    private inventarioService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.setMinDate();
    this.loadCategorias();
    this.loadIngredientes();
    this.loadInventario();

    // Escuchar cambios en la fecha de ingreso para actualizar la fecha mínima de vencimiento
    this.inventario.get('fecha_ingreso')?.valueChanges.subscribe((fechaIngreso) => {
      this.updateMinVencimientoDate(fechaIngreso);
    });
  }

  // Construimos el formulario
  private buildForm(): void {
    this.inventario = this.formBuilder.group({
      id_categoria: ['', Validators.required],
      id_ingrediente: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      fecha_ingreso: ['', Validators.required],
      fecha_vencimiento: ['', Validators.required]
    }, { validators: this.fechaVencimientoPosterior() });  // Validación personalizada);
  }

  // Establecemos la fecha mínima para el campo de fecha de ingreso
  private setMinDate(): void {
    const today = new Date();
    this.minDate = formatDate(today, 'yyyy-MM-dd', 'en');
  }

  // Cargamos las categorías desde el servicio
  private loadCategorias(): void {
    this.inventarioService.getcategorias().subscribe({
      next: (data) => {
        this.categoria_inventario = data;
      },
      error: (err) => console.error(err)
    });
  }

  // Cargamos los ingredientes desde el servicio
  private loadIngredientes(): void {
    this.inventarioService.getingredientes().subscribe({
      next: (data) => {
        this.ingredientes = data;
      },
      error: (err) => console.error(err)
    });
  }

  // Cargamos el inventario específico que se va a editar
  private loadInventario(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtenemos el ID del inventario a editar
    this.inventarioService.getinventarioId(id).subscribe({
      next: (data) => {
        this.inventario.patchValue({
          id_categoria: data.id_categoria,
          id_ingrediente: data.id_ingrediente,
          cantidad: data.cantidad,
          fecha_ingreso: formatDate(data.fecha_ingreso, 'yyyy-MM-dd', 'en'),
          fecha_vencimiento: formatDate(data.fecha_vencimiento, 'yyyy-MM-dd', 'en')
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


  // Guardamos los cambios
  save(): void {
    if (this.inventario.valid) {
      const formData = this.inventario.value;
      const id = this.route.snapshot.paramMap.get('id'); // Obtenemos el ID
  
      this.inventarioService.editinventario(formData, id).subscribe(
        () => {
          this.isSubmitted = true;
  
          // Mostrar SweetAlert2 al actualizar con éxito
          Swal.fire({
            title: '¡Inventario actualizado!',
            text: 'El inventario fue actualizado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Si selecciona "Ir a inventario"
              this.router.navigate(['/dashboard/inventario']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir editando", reseteamos el formulario
              this.inventario.reset();
              this.isSubmitted = false;
            }
          });
        },
        (error) => {
          console.error('Error al actualizar el inventario:', error);
          let errorMessage = 'Ocurrió un error al actualizar el inventario.';
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
      this.inventario.markAllAsTouched();
    }
  }
  
}
