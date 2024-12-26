import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-plato',
  templateUrl: './delete-plato.component.html',
  styleUrls: ['./delete-plato.component.scss']
})
export class DeletePlatoComponent implements OnInit {

  public platos: FormGroup;
  public platosId: string;
  public errorMessage: string = '';
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public reservation: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private platosService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.platosId = this.route.snapshot.paramMap.get('id');
    this.loadplatosData();
  }

  private buildForm(): void {
    this.platos = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private loadplatosData(): void {
    this.platosService.getplatosId(this.platosId).subscribe(
      (data: any) => {
        this.platos.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos de la categoria:', error);
        alert('Ocurrió un error al cargar datos de la categoria.');
      }
    );
  }



  public deleteD(): void {
    console.log('ID de la categoria a eliminar:', this.platosId);

    this.platosService.deleteplatos(this.platosId).subscribe(
      () => {
        this.isSubmitted = true;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/platos']);
        }, 2000);
      },
      (error) => {
        console.error('Error al eliminar el destino:', error);
        this.errorMessage = error;
      }
    );
  }

}


