import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-update-mesas',
  templateUrl: './update-mesas.component.html',
  styleUrls: ['./update-mesas.component.scss']
})
export class UpdateMesasComponent implements OnInit {

  public mesas: FormGroup;
  public mesasId: string;
  public isSuccess = false;  // Bandera para indicar éxito en la operación
  public isSubmitted = false; // Bandera para mostrar alerta de éxito
  public isSaving = false;

  constructor(
    private formBuilder: FormBuilder,
    private mesasService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.mesasId = this.route.snapshot.paramMap.get('id');
    console.log('ID de la mesa a editar:', this.mesasId); // Verificar el ID
    this.loadmesasData();  // Cargar los datos de la mesa
  }

  private buildForm(): void {
    this.mesas = this.formBuilder.group({
      numero: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],  // Solo números
      estado: [null]  // No asignar valor inicial hasta que cargue el dato
    });
  }

  private loadmesasData(): void {
    this.mesasService.getMesasById(this.mesasId).subscribe(
      (data: any) => {
        if (data && data.numero !== undefined && data.estado !== undefined) {
          console.log('Datos de la mesa cargados:', data); // Verificar datos

          // Convertir el estado a booleano, manejando posibles valores como 1, 0, 'true', 'false'
          const estadoBooleano = this.convertirEstado(data.estado);

          this.mesas.patchValue({
            numero: data.numero,
            estado: estadoBooleano  // Aquí aseguramos que sea true o false
          });
        } else {
          console.error('No se encontraron datos para la mesa con ID:', this.mesasId);
          alert('No se encontraron datos para la mesa.');
        }
      },
      (error) => {
        console.error('Error al cargar datos de la mesa:', error);
        alert('Ocurrió un error al cargar datos de la mesa.');
      }
    );
  }

  // Función para convertir cualquier valor de estado a booleano
  private convertirEstado(valor: any): boolean {
    if (typeof valor === 'string') {
      return valor.toLowerCase() === 'true';
    }
    return !!valor;  // Convertir a true o false cualquier valor (incluidos números)
  }


  save(): void {
    if (this.mesas.valid) {
      let formData = this.mesas.value;

      // Asegurarse de que el valor de estado sea true o false
      formData.estado = formData.estado === true;

      console.log('Datos que se están enviando al actualizar:', formData);

      this.mesasService.editMesas(formData, this.mesasId).subscribe(
        () => {
          this.isSuccess = true;
          this.isSubmitted = true;

          // Mostrar SweetAlert2 al actualizar con éxito
          Swal.fire({
            title: '¡Mesa actualizada!',
            text: 'La mesa fue actualizada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Si selecciona "Ir a mesas"
              this.router.navigate(['/dashboard/mesas']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir editando", reseteamos el formulario
              this.mesas.reset();
              this.isSubmitted = false;
            }
          });
        },
        (error) => {
          console.error('Error al actualizar la mesa:', error);
          let errorMessage = 'Ocurrió un error al actualizar la mesa.';
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
      this.mesas.markAllAsTouched();
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}