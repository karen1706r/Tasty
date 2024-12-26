import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from "./shared/shared.module";
import { AgmCoreModule } from '@agm/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

import * as $ from 'jquery';
import { CategoriasInventarioComponent } from './acomponent/categorias-inventario/categorias-inventario.component';
import { CategoriasplatosComponent } from './acomponent/categorias-platos/categorias-platos.component';
import { FacturasComponent } from './acomponent/facturas/facturas.component';
import { InventarioComponent } from './acomponent/inventario/inventario.component';
import { IngredientesComponent } from './acomponent/ingredientes/ingredientes.component';
import { MesasComponent } from './acomponent/mesas/mesas.component';
import { PedidosPorMesasComponent } from './acomponent/pedidos-por-mesas/pedidos-por-mesas.component';
import { PedidosComponent } from './acomponent/pedidos/pedidos.component';
import { PlatosIngredientesComponent } from './acomponent/platos-ingredientes/platos-ingredientes.component';
import { PlatosComponent } from './acomponent/platos/platos.component';
import { SesionesUsuariosComponent } from './acomponent/sesiones-usuarios/sesiones-usuarios.component';
import { TipodeusuarioComponent } from './acomponent/tipos-de-usuario/tipos-de-usuario.component';
import { usuariosComponent } from './acomponent/usuarios/usuarios.component';

import { AddCatinventarioComponent } from './add/add-catinventario/add-catinventario.component';
import { UpdateCatinventarioComponent } from './update/update-catinventario/update-catinventario.component';
import { DeleteCatinventarioComponent } from './delete/delete-catinventario/delete-catinventario.component';
import { AddMesasComponent } from './add/add-mesas/add-mesas.component';
import { DeleteMesasComponent } from './delete/delete-mesas/delete-mesas.component';
import { UpdateMesasComponent } from './update/update-mesas/update-mesas.component';
import { ShowMesasComponent } from './show/show-mesas/show-mesas.component';
import { HomeComponent } from './home/home.component';

import { AuthModule } from './auth/auth.module';
import { AddIngredientesComponent } from './add/add-ingredientes/add-ingredientes.component';
import { DeleteIngredientesComponent } from './delete/delete-ingredientes/delete-ingredientes.component';
import { UpdateIngredientesComponent } from './update/update-ingredientes/update-ingredientes.component';
import { UpdateCatplatoComponent } from './update/update-catplato/update-catplato.component';
import { AddCatplatosComponent } from './add/add-catplato/add-catplato.component';
import { DeleteCatplatoComponent } from './delete/delete-catplato/delete-catplato.component';
import { AddPlatoComponent } from './add/add-plato/add-plato.component';
import { UpdatePlatoComponent } from './update/update-plato/update-plato.component';
import { DeletePlatoComponent } from './delete/delete-plato/delete-plato.component';
import { AddInventarioComponent } from './add/add-inventario/add-inventario.component';
import { UpdateInventarioComponent } from './update/update-inventario/update-inventario.component';
import { DeleteInventarioComponent } from './delete/delete-inventario/delete-inventario.component';
import { AddtipodeusuarioComponent } from './add/add-tipodeusuario/add-tipodeusuario.component';
import { DeletetipodeusuarioComponent } from './delete/delete-tipodeusuario/delete-tipodeusuario.component';
import { UpdatetipodeusuarioComponent } from './update/update-tipodeusuario/update-tipodeusuario.component';
import { AddusuariosComponent } from './add/add-usuarios/add-usuarios.component';
import { DeleteusuariosComponent } from './delete/delete-usuarios/delete-usuarios.component';
import { UpdateusuarioComponent } from './update/update-usuarios/update-usuarios.component';
import { UpdatePlatosIngredientesComponent } from './update/update-platos-ingredientes/update-platos-ingredientes.component';
import { AddPlatosIngredientesComponent } from './add/add-platos-ingredientes/add-platos-ingredientes.component';
import { DeletePlatosIngredientesComponent } from './delete/delete-platos-ingredientes/delete-platos-ingredientes.component';
import { ShowMeseroComponent } from './show/show-mesero/show-mesero.component';
import { ShowComandaComponent } from './show/show-comanda/show-comanda.component';
import { ShowChefComponent } from './show/show-chef/show-chef.component';
import { ShowCajeroComponent } from './show/show-cajero/show-cajero.component';
import { PrediccionesComponent } from './Predicciones/predicciones.component';
import { ShowPreparacionesComponent } from './show/show-preparaciones/show-preparaciones.component';
import { ShowParrillaComponent } from './show/show-parrilla/show-parrilla.component';

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    ContentLayoutComponent,
    CategoriasInventarioComponent,
    CategoriasplatosComponent,
    FacturasComponent,
    InventarioComponent,
    IngredientesComponent,
    MesasComponent,
    PedidosPorMesasComponent,
    PedidosComponent,
    PlatosIngredientesComponent,
    PlatosComponent,
    SesionesUsuariosComponent,
    TipodeusuarioComponent,
    usuariosComponent,
    AddCatinventarioComponent,
    UpdateCatinventarioComponent,
    DeleteCatinventarioComponent,
    AddMesasComponent,
    DeleteMesasComponent,
    UpdateMesasComponent,
    ShowMesasComponent,
    HomeComponent,
    AddIngredientesComponent,
    DeleteIngredientesComponent,
    UpdateIngredientesComponent,
    UpdateCatplatoComponent,
    AddCatplatosComponent,
    DeleteCatplatoComponent,
    AddPlatoComponent,
    UpdatePlatoComponent,
    DeletePlatoComponent,
    AddInventarioComponent,
    UpdateInventarioComponent,
    DeleteInventarioComponent,
    AddtipodeusuarioComponent,
    DeletetipodeusuarioComponent,
    UpdatetipodeusuarioComponent,
    AddusuariosComponent,
    DeleteusuariosComponent,
    UpdateusuarioComponent,
    AddPlatosIngredientesComponent,
    UpdatePlatosIngredientesComponent,
    DeletePlatosIngredientesComponent,
    UpdatePlatosIngredientesComponent,
    AddPlatosIngredientesComponent,
    DeletePlatosIngredientesComponent,
    ShowMeseroComponent,
    ShowComandaComponent,
    ShowChefComponent,
    ShowCajeroComponent,
    PrediccionesComponent,
    ShowPreparacionesComponent,
    ShowParrillaComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyDKXKdHQdtqgPVl2HI2RnUa_1bjCxRCQo4' }),
    PerfectScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([]),
    AuthModule 
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
