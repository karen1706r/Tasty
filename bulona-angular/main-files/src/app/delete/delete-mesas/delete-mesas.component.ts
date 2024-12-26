import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-mesas',
  templateUrl: './delete-mesas.component.html',
  styleUrls: ['./delete-mesas.component.scss']
})
export class DeleteMesasComponent implements OnInit {

  public mesas: FormGroup;
  public mesasId: string;
  public errorMessage: string = '';
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public reservation: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private mesasService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.mesasId = this.route.snapshot.paramMap.get('id');
    this.loadmesasData();
  }

  private buildForm(): void {
    this.mesas = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private loadmesasData(): void {
    this.mesasService.getMesasById(this.mesasId).subscribe(
      (data: any) => {
        this.mesas.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos de la categoria:', error);
        alert('Ocurrió un error al cargar datos de la categoria.');
      }
    );
  }



  public deleteD(): void {
    console.log('ID de la categoria a eliminar:', this.mesasId);

    this.mesasService.deletecategoriasinventario(this.mesasId).subscribe(
      () => {
        this.isSubmitted = true;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/mesas']);
        }, 2000);
      },
      (error) => {
        console.error('Error al eliminar el destino:', error);
        this.errorMessage = error;
      }
    );
  }

}
