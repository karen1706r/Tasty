import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-delete-tipodeusuario',
  templateUrl: './delete-tipodeusuario.component.html',
  styleUrls: ['./delete-tipodeusuario.component.scss']
})
export class DeletetipodeusuarioComponent implements OnInit {

  public tipodeusuario: FormGroup;
  public tipodeusuarioId: string;
  public errorMessage: string = '';
  public isSubmitted: boolean = false;
  public isSaving: boolean = false;
  public reservation: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private tipodeusuarioService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.tipodeusuarioId = this.route.snapshot.paramMap.get('id');
    this.loadtipodeusuarioData();
  }

  private buildForm(): void {
    this.tipodeusuario = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private loadtipodeusuarioData(): void {
    this.tipodeusuarioService.gettipodeusuarioId(this.tipodeusuarioId).subscribe(
      (data: any) => {
        this.tipodeusuario.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar datos de la categoria:', error);
        alert('Ocurrió un error al cargar datos de la categoria.');
      }
    );
  }



  public deleteD(): void {
    console.log('ID de la categoria a eliminar:', this.tipodeusuarioId);

    this.tipodeusuarioService.deletetipodeusuario(this.tipodeusuarioId).subscribe(
      () => {
        this.isSubmitted = true;
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/tipo_de_usuario']);
        }, 2000);
      },
      (error) => {
        console.error('Error al eliminar el destino:', error);
        this.errorMessage = error;
      }
    );
  }

}