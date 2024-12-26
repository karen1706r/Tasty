import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-update-catinventario',
  templateUrl: './update-catinventario.component.html',
  styleUrls: ['./update-catinventario.component.scss']
})
export class UpdateCatinventarioComponent implements OnInit {

  public catinventario: FormGroup;
  public catinventarioId: string;
  public isSuccess = false;
  public isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private catinventarioService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.catinventarioId = this.route.snapshot.paramMap.get('id');
    this.loadcatinventarioData();
  }

  private buildForm(): void {
    this.catinventario = this.formBuilder.group({
      nombre_categoria: ['', [Validators.required, Validators.minLength(4)]],
      estado: [false]  // Inicializamos el estado como false
    });
  }

  private loadcatinventarioData(): void {
    this.catinventarioService.getcatinventarioId(this.catinventarioId).subscribe(
      (data: any) => {
        if (data) {
          this.catinventario.patchValue({
            nombre_categoria: data.nombre_categoria,
            estado: data.estado !== null ? Boolean(data.estado) : false  // Convertimos a booleano
          });
        } else {
          console.error('No se encontraron datos para la categoría con ID:', this.catinventarioId);
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
    if (this.catinventario.valid) {
      console.log("Valores enviados para actualización:", this.catinventario.value); // Verifica los datos antes de enviar
      // Asegúrate de que se envía el valor booleano
      const dataToUpdate = {
        nombre_categoria: this.catinventario.value.nombre_categoria,
        estado: this.catinventario.value.estado === true  // Asegúrate de enviar true o false
      };

      this.catinventarioService.editcategoriasinventario(dataToUpdate, this.catinventarioId).subscribe(
        () => {
          this.isSuccess = true;
          this.isSubmitted = true;
  
          Swal.fire({
            title: '¡Categoría actualizada!',
            text: 'La categoría fue actualizada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/dashboard/categorias-inventario']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.catinventario.reset();
              this.isSubmitted = false;
            }
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
            confirmButtonText: 'Aceptar',
          });
        }
      );
    } else {
      this.catinventario.markAllAsTouched();
    }
  }
  
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
