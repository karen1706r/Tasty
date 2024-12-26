import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-catplato',
  templateUrl: './delete-catplato.component.html',
  styleUrls: ['./delete-catplato.component.scss']
})
export class DeleteCatplatoComponent implements OnInit {

  public catplato: FormGroup;
  public catplatoId: string;
  public errorMessage: string = '';
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public reservation: any = null;

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
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private loadcatplatoData(): void {
    this.catplatoService.getcategoriasplatosId(this.catplatoId).subscribe(
      (data: any) => {
        this.catplato.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos de la categoria:', error);
        alert('Ocurrió un error al cargar datos de la categoria.');
      }
    );
  }



  public deleteD(): void {
    console.log('ID de la categoria a eliminar:', this.catplatoId);

    this.catplatoService.deletecategoriasplatos(this.catplatoId).subscribe(
      () => {
        this.isSubmitted = true;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/catplato']);
        }, 2000);
      },
      (error) => {
        console.error('Error al eliminar el destino:', error);
        this.errorMessage = error;
      }
    );
  }

}
