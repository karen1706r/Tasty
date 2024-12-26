import { Component, OnInit } from '@angular/core';
import { RestauranteService } from './services/restaurante.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private restauranteService: RestauranteService) {}

  ngOnInit(): void {
    // Llama a cargar inventario y verificar alertas al iniciar la aplicación
    this.restauranteService.cargarInventarioYVerificarAlertas();
  }
}
