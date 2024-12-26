import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-ingredientes',
  templateUrl: './delete-ingredientes.component.html',
  styleUrls: ['./delete-ingredientes.component.scss']
})
export class DeleteIngredientesComponent implements OnInit {

  public ingredientes: FormGroup;
  public ingredientesId: string;
  public errorMessage: string = '';
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public reservation: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private ingredientesService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.ingredientesId = this.route.snapshot.paramMap.get('id');
    this.loadingredientesData();
  }

  private buildForm(): void {
    this.ingredientes = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private loadingredientesData(): void {
    this.ingredientesService.getingredientesId(this.ingredientesId).subscribe(
      (data: any) => {
        this.ingredientes.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos de la categoria:', error);
        alert('Ocurrió un error al cargar datos de la categoria.');
      }
    );
  }



  public deleteD(): void {
    console.log('ID de la categoria a eliminar:', this.ingredientesId);

    this.ingredientesService.deleteingredientes(this.ingredientesId).subscribe(
      () => {
        this.isSubmitted = true;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/ingredientes']);
        }, 2000);
      },
      (error) => {
        console.error('Error al eliminar el destino:', error);
        this.errorMessage = error;
      }
    );
  }

}
