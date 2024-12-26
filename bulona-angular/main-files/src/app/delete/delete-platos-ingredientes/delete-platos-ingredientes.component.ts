import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-platos-ingredientes',
  templateUrl: './delete-platos-ingredientes.component.html',
  styleUrls: ['./delete-platos-ingredientes.component.scss']
})
export class DeletePlatosIngredientesComponent implements OnInit {
  
  public platosingredientes: FormGroup;
  public platosingredientesId: number; // Cambiar a number
  public errorMessage: string = '';
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private platosingredientesService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    const id = this.route.snapshot.paramMap.get('id');
    this.platosingredientesId = Number(id); // Convertir a número
    this.loadinventarioData();
  }

  private buildForm(): void {
    this.platosingredientes = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private loadinventarioData(): void {
    this.platosingredientesService.getplatosingredientesId(this.platosingredientesId).subscribe(
      (data: any) => {
        this.platosingredientes.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos de la categoria:', error);
        alert('Ocurrió un error al cargar datos de la categoría.');
      }
    );
  }

  public deleteD(): void {
    console.log('ID de la categoría a eliminar:', this.platosingredientesId);

    this.platosingredientesService.deleteplatosingredientes(this.platosingredientesId).subscribe(
      () => {
        this.isSubmitted = true;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/platos-ingredientes']);
        }, 2000);
      },
      (error) => {
        console.error('Error al eliminar el destino:', error);
        this.errorMessage = error.message || 'Error desconocido al eliminar.';
        alert(`Error: ${this.errorMessage}`); // Alert para mostrar el mensaje de error
      }
    );
  }

}
