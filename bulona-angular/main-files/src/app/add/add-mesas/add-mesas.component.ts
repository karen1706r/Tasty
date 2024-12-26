import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-mesas',
  templateUrl: './add-mesas.component.html',
  styleUrls: ['./add-mesas.component.scss']
})
export class AddMesasComponent implements OnInit {
  public mesas: FormGroup;
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private mesasService: RestauranteService,
    private router: Router,
    private cd: ChangeDetectorRef // Para forzar la actualización manual de la vista
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.mesas = this.formBuilder.group({
      numero: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Campo requerido y solo números
      estado: [false] // Checkbox o campo booleano
    });

    // Forzar la actualización de la vista si el estado del formulario cambia
    this.mesas.statusChanges.subscribe(() => {
      this.cd.detectChanges();
    });
  }

  save(): void {
    if (this.mesas.valid) {
        const formData = this.mesas.value;
        console.log('Verificando si el número de mesa existe:', formData.numero); // Agregar log
        this.isSaving = true;

        // Comprobar si el número de mesa ya existe en la base de datos
        this.mesasService.getMesasByNumero(formData.numero).subscribe(
            (existe: boolean) => {
                console.log('¿Existe la mesa?', existe); // Agregar log
                if (existe) {
                    // Mostrar mensaje de error si el número ya existe
                    Swal.fire({
                        title: 'Número duplicado',
                        text: 'Este número de mesa ya existe. Por favor, ingrese un número diferente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    this.isSaving = false; // Asegúrate de que esto esté en el lugar correcto
                } else {
                    // Guardar la mesa si el número no existe
                    this.mesasService.addMesas(formData).subscribe(
                        () => {
                            this.isSubmitted = true;
                            this.isSaving = false;

                            // Mostrar SweetAlert2 con dos opciones: ir a la lista o seguir registrando
                            Swal.fire({
                                title: '¡Mesa creada!',
                                text: 'La mesa fue guardada exitosamente.',
                                icon: 'success',
                                showCancelButton: true,
                                confirmButtonText: 'Ir a mesas',
                                cancelButtonText: 'Seguir registrando',
                                reverseButtons: true
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // Si selecciona "Ir a mesas"
                                    this.router.navigate(['/dashboard/mesas']);
                                } else if (result.dismiss === Swal.DismissReason.cancel) {
                                    // Si selecciona "Seguir registrando", reseteamos el formulario
                                    this.mesas.reset();
                                    this.isSubmitted = false;
                                }
                            });
                        },
                        (error) => {
                            console.error('Error al guardar la mesa:', error);
                            this.isSaving = false;
                            Swal.fire({
                                title: 'Número duplicado',
                                text: 'Este número de mesa ya existe. Por favor, ingrese un número diferente.',
                                icon: 'warning',
                                confirmButtonText: 'Aceptar'
                            });
                        }
                    );
                }
            },
            (error) => {
                console.error('Error al verificar el número de mesa:', error);
                this.isSaving = false;
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al verificar el número de la mesa.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        );
    } else {
        console.log('El formulario es inválido');
        this.mesas.markAllAsTouched();
    }
}

}
