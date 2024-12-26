import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-inventario',
  templateUrl: './delete-inventario.component.html',
  styleUrls: ['./delete-inventario.component.scss']
})
export class DeleteInventarioComponent implements OnInit {

  public inventario: FormGroup;
  public inventarioId: string;
  public errorMessage: string = '';
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public reservation: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private inventarioService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.inventarioId = this.route.snapshot.paramMap.get('id');
    this.loadinventarioData();
  }

  private buildForm(): void {
    this.inventario = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private loadinventarioData(): void {
    this.inventarioService.getinventarioId(this.inventarioId).subscribe(
      (data: any) => {
        this.inventario.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos de la categoria:', error);
        alert('Ocurrió un error al cargar datos de la categoria.');
      }
    );
  }



  public deleteD(): void {
    console.log('ID de la categoria a eliminar:', this.inventarioId);

    this.inventarioService.deleteinventario(this.inventarioId).subscribe(
      () => {
        this.isSubmitted = true;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/inventario']);
        }, 2000);
      },
      (error) => {
        console.error('Error al eliminar el destino:', error);
        this.errorMessage = error;
      }
    );
  }

}
