import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-update-plato',
  templateUrl: './update-plato.component.html',
  styleUrls: ['./update-plato.component.scss']
})
export class UpdatePlatoComponent implements OnInit {
  public platosForm: FormGroup;  // Formulario reactivo
  public isSuccess: boolean = false;  // Variable para manejar el mensaje de éxito
  public isSubmitted: boolean = false;  // Bandera para indicar si el formulario ha sido enviado
  public isSaving = false;
  public categorias: any[] = [];  // Categorías disponibles
  public selectedFile: File | null = null;  // Inicializa como null
  public platosId: string = '';  // ID del plato a editar

  constructor(
    private formBuilder: FormBuilder,
    private platosService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadCategorias();
    this.platosId = this.route.snapshot.paramMap.get('id') || '';  // Obtener el ID del plato a editar
    if (this.platosId) {
      this.loadPlatoData();
    }
  }

  private buildForm(): void {
    this.platosForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],  // Nombre del plato
      id_categoria: ['', Validators.required],  // ID de la categoría
      precio: ['', [Validators.required, Validators.min(1)]],  // Precio
      ruta: ['']  // Ruta de la imagen
    });
  }

  private loadCategorias(): void {
    this.platosService.getcategoriasplatos().subscribe(
      (data: any) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );
  }

  private loadPlatoData(): void {
    this.platosService.getplatosId(this.platosId).subscribe(
        (data: any) => {
            this.platosForm.patchValue({
                nombre: data.nombre,  // Cargar el nombre del plato
                id_categoria: data.id_categoria,
                precio: data.precio,
                ruta: data.ruta
            });
            this.selectedFile = null; // Resetear el archivo seleccionado
        },
        (error) => {
            console.error('Error al cargar los datos del plato', error);
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
      
      // Verificar el contenido de FormData usando forEach
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      
      // Llamada al servicio para actualizar el plato
      this.platosService.editplatos(formData, this.platosId).subscribe(
        response => {
          this.isSuccess = true;  // Indica que la actualización fue exitosa
          console.log('Plato actualizado:', response);
  
          // Mostrar SweetAlert2 al actualizar con éxito
          Swal.fire({
            title: '¡Plato actualizado!',
            text: 'El plato fue actualizado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirigir a la página de platos
              this.router.navigate(['/dashboard/platos']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Si selecciona "Seguir editando", reseteamos el formulario
              this.platosForm.reset();
              this.isSubmitted = false;
            }
          });
        },
        error => {
          console.error('Error al actualizar el plato:', error);
          let errorMessage = 'Ocurrió un error al actualizar el plato.';
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
      console.log('Formulario no válido', this.platosForm.errors); // Log de errores del formulario
      this.platosForm.markAllAsTouched(); // Marca todos los campos como tocados
    }
  }
  

}
