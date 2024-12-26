import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-update-catplato',
  templateUrl: './update-catplato.component.html',
  styleUrls: ['./update-catplato.component.scss']
})
export class UpdateCatplatoComponent implements OnInit {
  public catplato: FormGroup;
  public catplatoId: string;
  public isSuccess = false;
  public isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private catplatoService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.catplatoId = this.route.snapshot.paramMap.get('id');
    this.loadcatplatoData();
  }

  private buildForm(): void {
    this.catplato = this.formBuilder.group({
      nombre_categoria: ['', [Validators.required, Validators.minLength(4)]],
      estado: [false] // Asignar un valor inicial como false
    });
  }

  private loadcatplatoData(): void {
    this.catplatoService.getcategoriasplatosId(this.catplatoId).subscribe(
      (data: any) => {
        if (data) {
          const estadoBooleano = this.convertirEstado(data.estado);
          this.catplato.patchValue({
            nombre_categoria: data.nombre_categoria,
            estado: estadoBooleano
          });
        } else {
          alert('No se encontraron datos para la categoría.');
        }
      },
      (error) => {
        alert('Ocurrió un error al cargar datos de la categoría.');
      }
    );
  }

  private convertirEstado(valor: any): boolean {
    return typeof valor === 'string' ? valor.toLowerCase() === 'true' : !!valor;
  }

  save(): void {
    if (this.catplato.valid) {
      this.catplatoService.editcategoriasplatos(this.catplato.value, this.catplatoId).subscribe(
        () => {
          this.isSuccess = true; // Activar la bandera isSuccess
          this.isSubmitted = true; // Activar la bandera isSubmitted para mostrar la alerta
  
          // Mostrar SweetAlert2 al actualizar con éxito
          Swal.fire({
            title: '¡Categoría actualizada!',
            text: 'La categoría fue actualizada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirigir a la página de categorías
              this.router.navigate(['/dashboard/categorias-platos']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir editando", reseteamos el formulario
              this.catplato.reset();
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
      this.catplato.markAllAsTouched(); // Marcar todos los campos como tocados si el formulario es inválido
    }
  }
  

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
