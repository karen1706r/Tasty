import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';  // Importar SweetAlert2

@Component({
  selector: 'app-add-plato',
  templateUrl: './add-plato.component.html',
  styleUrls: ['./add-plato.component.scss']
})
export class AddPlatoComponent implements OnInit {
  public platosForm: FormGroup;  // Formulario reactivo
  public isSubmitted: boolean = false;  // Bandera para indicar si el formulario ha sido enviado
  public categorias: any[] = [];  // Categorías disponibles
  public selectedFile: File | null = null;  // Inicializa como null

  constructor(
    private formBuilder: FormBuilder,
    private platosService: RestauranteService,
    private router: Router,
    private cd: ChangeDetectorRef // Para forzar la actualización manual de la vista
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadCategorias();  // Cargar las categorías disponibles al inicializar
  }

  private buildForm(): void {
    this.platosForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],  // Nombre del plato
      id_categoria: ['', Validators.required],  // ID de la categoría
      precio: ['', [Validators.required, Validators.min(1)]],  // Precio
    });

    // Forzar la actualización de la vista si el estado del formulario cambia
    this.platosForm.statusChanges.subscribe(() => {
      this.cd.detectChanges(); 
    });
  }

  private loadCategorias(): void {
    this.platosService.getcategoriasplatos().subscribe(
      (data: any) => {
        // Filtrar las categorías para incluir solo aquellas que están activas
        this.categorias = data.filter((categoria: any) => categoria.estado);  // Solo categorías con estado true
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );
  }

  public onFileSelected(event: any): void {
    const file: File = event.target.files[0];  // Obtén el archivo seleccionado
    if (file) {
      this.selectedFile = file;  // Almacena el archivo seleccionado
    }
  }

  public save(): void {
    this.isSubmitted = true;  // Marca el formulario como enviado
    if (this.platosForm.valid) {
      // Crear una instancia de FormData
      const formData = new FormData();
      formData.append('nombre', this.platosForm.get('nombre')?.value);
      formData.append('id_categoria', this.platosForm.get('id_categoria')?.value);
      formData.append('precio', this.platosForm.get('precio')?.value);
      
      // Solo añade la imagen si se ha seleccionado un archivo
      if (this.selectedFile) {
        formData.append('ruta', this.selectedFile);  // Nombre del campo debe coincidir con el backend
      }
      
      // Llamada al servicio para agregar el nuevo plato
      this.platosService.addplatos(formData).subscribe(
        response => {
          this.isSubmitted = false;  // Restablece la bandera de envío
          
          // Mostrar SweetAlert2 con opciones
          Swal.fire({
            title: '¡Plato creado!',
            text: 'El plato fue guardado exitosamente.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ir a platos',
            cancelButtonText: 'Seguir registrando',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Si selecciona "Ir a platos"
              this.router.navigate(['/dashboard/platos']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir registrando", reseteamos el formulario
              this.platosForm.reset();
              this.selectedFile = null; // Resetea el archivo seleccionado
            }
          });
        },
        error => {
          console.error('Error al agregar el plato:', error);
          let errorMessage = 'Ocurrió un error al agregar el plato.';
          if (error && error.error && error.error.message) {
            errorMessage = error.error.message; // Mensaje específico de error
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
      console.log('Formulario no válido', this.platosForm.errors); // Log de errores del formulario
      this.platosForm.markAllAsTouched(); // Marca todos los campos como tocados
    }
  }
}
