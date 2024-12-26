import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias-platos',
  templateUrl: './categorias-platos.component.html',
  styleUrls: ['./categorias-platos.component.scss']
})
export class CategoriasplatosComponent implements OnInit {
  public categoriasplatos: any[] = [];

  constructor(
    private ps: RestauranteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadCategoriasPlatos();
  }

  private loadCategoriasPlatos(): void {
    this.ps.getcategoriasplatos().subscribe({
      next: (data) => {
        this.categoriasplatos = data;
        console.log(data);
      },
      error: (err) => console.error(err)
    });
  }

  agregarCatplatos(): void {
    this.router.navigate(['dashboard/add-catplato']);
  }

  editarCatplatos(id: string): void {
    const categoria = this.categoriasplatos.find(cat => cat.id === id);
    if (this.isCategoriaBebidas(categoria)) {
      return;
    }
    this.router.navigate(['dashboard/update-catplato/' + id]);
  }

  borrarCatplatos(id: string): void {
    const categoria = this.categoriasplatos.find(cat => cat.id === id);
    if (this.isCategoriaBebidas(categoria)) {
      return;
    }

    Swal.fire({
      title: 'No puedes eliminar una categoría',
      text: 'Pero puedes deshabilitarla. ¿Quieres ir a deshabilitar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ir a deshabilitar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.irADeshabilitar(id);
      }
    });
  }

  irADeshabilitar(id: string): void {
    this.router.navigate(['/dashboard/update-catplato', id]);
  }

  verCatplatos(id: string): void {
    this.router.navigate(['dashboard/show-categorias-platos/' + id]);
  }

  isCategoriaBebidas(categoria: any): boolean {
    return categoria.nombre_categoria.toLowerCase() === 'bebidas';
  }
}