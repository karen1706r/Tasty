import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-platos-ingredientes',
  templateUrl: './update-platos-ingredientes.component.html',
  styleUrls: ['./update-platos-ingredientes.component.scss']
})
export class UpdatePlatosIngredientesComponent implements OnInit {
  public platoFormGroup: FormGroup;
  public ingredientes: any[] = []; // Lista de ingredientes disponibles
  public platos: any[] = []; // Lista de platos disponibles
  private idPlatoIngrediente: number; // ID del plato ingrediente a editar

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ps: RestauranteService,
    private router: Router
  ) {
    // Inicializar el formulario
    this.platoFormGroup = this.fb.group({
      nombre_plato: ['', Validators.required], // Campo para el nombre del plato
      ingredientes: this.fb.array([]) // Inicializar el FormArray para ingredientes
    });
  }

  ngOnInit(): void {
    this.idPlatoIngrediente = +this.route.snapshot.paramMap.get('id')!; // Obtener ID del plato ingrediente
    this.loadIngredientes(); // Cargar los ingredientes
    this.loadPlatos(); // Cargar los platos
    this.loadPlatoIngrediente(); // Cargar el plato ingrediente específico
  }

  private loadPlatos(): void {
    this.ps.getplatos().subscribe({
      next: (data) => {
        this.platos = data; // Guardar los platos disponibles
      },
      error: () => Swal.fire('Error', 'Ocurrió un error al cargar los platos.', 'error')
    });
  }

  private loadIngredientes(): void {
    this.ps.getingredientes().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.ingredientes = data; // Guardar los ingredientes disponibles
          this.initializeIngredientControls(); // Inicializar los controles de ingredientes
        } else {
          Swal.fire('Error', 'La respuesta de los ingredientes no es un array.', 'error');
        }
      },
      error: () => Swal.fire('Error', 'Ocurrió un error al cargar los ingredientes.', 'error')
    });
  }

  private initializeIngredientControls(): void {
    const ingredientesArray = this.platoFormGroup.get('ingredientes') as FormArray;
    ingredientesArray.clear(); // Limpiar el FormArray antes de inicializar

    this.ingredientes.forEach(ingrediente => {
      const formGroup = this.fb.group({
        id: [ingrediente.id], // ID del ingrediente
        nombre: [{ value: ingrediente.nombre, disabled: true }], // Nombre del ingrediente (solo visualización)
        isSelected: [false], // Estado de selección
        cantidad: [0, Validators.required] // Cantidad del ingrediente, inicializada en 0
      });

      ingredientesArray.push(formGroup); // Añadir control al FormArray
    });
  }

  private loadPlatoIngrediente(): void {
    this.ps.getplatosingredientesId(this.idPlatoIngrediente).subscribe({
      next: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const ingredientesDelPlato = data.map(item => ({
            id: item.id,
            nombre_plato: item.ingredientes_model.nombre, // Nombre del ingrediente
            id_plato: item.ingredientes_model.id,
            cantidad: Number(item.cantidad)
          }));

          this.platoFormGroup.get('nombre_plato').setValue(data[0].platos_model.nombre);
          const ingredientesFormArray = this.platoFormGroup.get('ingredientes') as FormArray;

          // Limpiar el FormArray antes de inicializar
          ingredientesFormArray.clear();

          for (let ing of this.ingredientes) {
            const formGroup = this.fb.group({
              id: [ing.id], // ID del ingrediente
              nombre: [{ value: ing.nombre, disabled: true }], // Nombre del ingrediente (solo visualización)
              isSelected: [false], // Estado de selección
              cantidad: [0, Validators.required] // Cantidad del ingrediente, inicializada en 0
            });

            // Verificar si el ingrediente está en la lista de ingredientes del plato
            const ingredienteDelPlato = ingredientesDelPlato.find(i => i.id_plato === ing.id);
            if (ingredienteDelPlato) {
              formGroup.get('isSelected')?.setValue(true); // Marcar como seleccionado
              formGroup.get('cantidad')?.setValue(ingredienteDelPlato.cantidad); // Asignar la cantidad existente
            }

            ingredientesFormArray.push(formGroup); // Añadir control al FormArray
          }
        } else {
          Swal.fire('Error', 'No se encontró información del plato con ingredientes.', 'error');
        }
      },
      error: () => Swal.fire('Error', 'Ocurrió un error al cargar el ingrediente del plato.', 'error')
    });
  }

  save(): void {
    if (this.platoFormGroup.valid) {
      const selectedPlato = this.platos.find(plato => plato.nombre === this.platoFormGroup.get('nombre_plato')?.value)?.id;

      const ingredientesAActualizar = [];
      const ingredientesAEliminar = [];

      const ingredientesArray = this.platoFormGroup.get('ingredientes') as FormArray;
      ingredientesArray.controls.forEach((control) => {
        const ingrediente = control.value;

        if (ingrediente.isSelected) {
          // Si la cantidad está en 0, se cambia a 1 antes de actualizar
          const cantidad = ingrediente.cantidad > 0 ? ingrediente.cantidad : 1;
          ingredientesAActualizar.push({
            id_ingredientes: ingrediente.id,
            cantidad: cantidad
          });
        } else {
          // Agregar a la lista de eliminados solo si el ID es válido
          if (ingrediente.id) {
            ingredientesAEliminar.push(ingrediente.id);
          }
        }
      });

      // Si no hay ingredientes seleccionados para actualizar o eliminar, muestra advertencia
      if (ingredientesAActualizar.length === 0 && ingredientesAEliminar.length === 0) {
        Swal.fire('Advertencia', 'Debe seleccionar al menos un ingrediente para actualizar o eliminar.', 'warning');
        return;
      }

      const payload = {
        id_plato: selectedPlato,  // ID del plato que se está editando
        ingredientes: ingredientesAActualizar,
        ingredientes_a_eliminar: ingredientesAEliminar
      };

      console.log("Payload enviado:", payload);

      // Llama al servicio para la actualización
      this.ps.editplatosingredientes(payload).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Plato ingrediente actualizado correctamente.', 'success');
          this.router.navigate(['/dashboard/platos-ingredientes']);
        },
        error: (error) => {
          console.error("Error en la actualización:", error);
          Swal.fire('Error', 'No se pudo actualizar el plato ingrediente.', 'error');
        }
      });
    } else {
      Swal.fire('Advertencia', 'Por favor, complete todos los campos requeridos.', 'warning');
    }
  }
}
