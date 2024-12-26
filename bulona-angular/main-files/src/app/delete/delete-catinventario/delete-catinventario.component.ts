import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-catinventario',
  templateUrl: './delete-catinventario.component.html',
  styleUrls: ['./delete-catinventario.component.scss']
})
export class DeleteCatinventarioComponent implements OnInit {

  public catinventario: FormGroup;
  public catinventarioId: string;
  public errorMessage: string = '';
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public reservation: any = null;

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
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private loadcatinventarioData(): void {
    this.catinventarioService.getcatinventarioId(this.catinventarioId).subscribe(
      (data: any) => {
        this.catinventario.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos de la categoria:', error);
        alert('Ocurrió un error al cargar datos de la categoria.');
      }
    );
  }



  public deleteD(): void {
    console.log('ID de la categoria a eliminar:', this.catinventarioId);

    this.catinventarioService.deletecategoriasinventario(this.catinventarioId).subscribe(
      () => {
        this.isSubmitted = true;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/catinventario']);
        }, 2000);
      },
      (error) => {
        console.error('Error al eliminar el destino:', error);
        this.errorMessage = error;
      }
    );
  }

}
