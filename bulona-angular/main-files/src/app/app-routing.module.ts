import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { PedidosPorMesasComponent } from './acomponent/pedidos-por-mesas/pedidos-por-mesas.component';

import { AddCatplatosComponent } from '../app/add/add-catplato/add-catplato.component';
import { AddIngredientesComponent } from '../app/add/add-ingredientes/add-ingredientes.component';
import { AddCatinventarioComponent } from '../app/add/add-catinventario/add-catinventario.component';
import { AddMesasComponent } from '../app/add/add-mesas/add-mesas.component';
import { AddPlatoComponent } from '../app/add/add-plato/add-plato.component';
import { AddInventarioComponent } from '../app/add/add-inventario/add-inventario.component';
import { AddtipodeusuarioComponent } from '../app/add/add-tipodeusuario/add-tipodeusuario.component';
import { AddusuariosComponent } from '../app/add/add-usuarios/add-usuarios.component';
import { AddPlatosIngredientesComponent } from '../app/add/add-platos-ingredientes/add-platos-ingredientes.component';

import { UpdateIngredientesComponent } from '../app/update/update-ingredientes/update-ingredientes.component';
import { UpdateCatinventarioComponent } from '../app/update/update-catinventario/update-catinventario.component';
import { UpdateMesasComponent } from '../app/update/update-mesas/update-mesas.component';
import { UpdateCatplatoComponent } from '../app/update/update-catplato/update-catplato.component';
import { UpdatePlatoComponent } from '../app/update/update-plato/update-plato.component';
import { UpdateInventarioComponent } from '../app/update/update-inventario/update-inventario.component';
import { UpdatetipodeusuarioComponent } from '../app/update/update-tipodeusuario/update-tipodeusuario.component';
import { UpdateusuarioComponent } from '../app/update/update-usuarios/update-usuarios.component';
import { UpdatePlatosIngredientesComponent } from '../app/update/update-platos-ingredientes/update-platos-ingredientes.component';

import { DeleteCatinventarioComponent } from '../app/delete/delete-catinventario/delete-catinventario.component';
import { DeleteMesasComponent } from '../app/delete/delete-mesas/delete-mesas.component';
import { DeleteIngredientesComponent } from '../app/delete/delete-ingredientes/delete-ingredientes.component';
import { DeleteCatplatoComponent } from '../app/delete/delete-catplato/delete-catplato.component';
import { DeletePlatoComponent } from '../app/delete/delete-plato/delete-plato.component';
import { DeleteInventarioComponent } from '../app/delete/delete-inventario/delete-inventario.component';
import { DeletetipodeusuarioComponent } from '../app/delete/delete-tipodeusuario/delete-tipodeusuario.component';
import { DeleteusuariosComponent } from '../app/delete/delete-usuarios/delete-usuarios.component';
import { DeletePlatosIngredientesComponent } from '../app/delete/delete-platos-ingredientes/delete-platos-ingredientes.component';

import { ShowMesasComponent } from '../app/show/show-mesas/show-mesas.component';
import {ShowChefComponent} from '../app/show/show-chef/show-chef.component';
import {ShowComandaComponent} from '../app/show/show-comanda/show-comanda.component';
import {ShowPreparacionesComponent} from '../app/show/show-preparaciones/show-preparaciones.component';
import {ShowParrillaComponent} from '../app/show/show-parrilla/show-parrilla.component';


import {ShowCajeroComponent} from '../app/show/show-cajero/show-cajero.component';


import {FacturasComponent} from '../app/acomponent/facturas/facturas.component';
import {PrediccionesComponent} from '../app/Predicciones/predicciones.component';




import { SignInComponent } from './auth/sign-in/sign-in.component';

import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full',
  },


  


  { path: 'auth/sign-in', component: SignInComponent },



  { path: 'Predicciones', component: PrediccionesComponent },
  
  { path: 'pedidos-por-mesas/:id', component: PedidosPorMesasComponent },
  { path: 'factura/:idMesa', component: FacturasComponent },
  { path: '', redirectTo: '/show-cajero', pathMatch: 'full' },


  { path: 'add-catplato', component: AddCatplatosComponent },
  { path: 'add-ingredientes', component: AddIngredientesComponent },
  { path: 'add-catinventario', component: AddCatinventarioComponent },
  { path: 'add-mesas', component: AddMesasComponent },
  { path: 'add-plato', component: AddPlatoComponent },
  { path: 'add-inventario', component: AddInventarioComponent },
  { path: 'add-tipodeusuario', component: AddtipodeusuarioComponent },
  { path: 'add-usuarios', component: AddusuariosComponent },
  { path: 'add-platos-ingredientes', component: AddPlatosIngredientesComponent },

  { path: 'update-ingredienteso/:id', component: UpdateIngredientesComponent },
  { path: 'update-catinventario/:id', component: UpdateCatinventarioComponent },
  { path: 'update-mesas/:id', component: UpdateMesasComponent },
  { path: 'update-catplato/:id', component: UpdateCatplatoComponent },
  { path: 'update-plato/:id', component: UpdatePlatoComponent },
  { path: 'update-inventario/:id', component: UpdateInventarioComponent },
  { path: 'update-tipodeusuario/:id', component: UpdatetipodeusuarioComponent },
  { path: 'update-usuario/:id', component: UpdateusuarioComponent },
  { path: 'update-platos-ingredientes/:id', component: UpdatePlatosIngredientesComponent },

  
  { path: 'delete-catinventario/:id', component: DeleteCatinventarioComponent },
  { path: 'delete-ingredientes/:id', component: DeleteIngredientesComponent },
  { path: 'delete-mesas/:id', component: DeleteMesasComponent },
  { path: 'delete-catplato/:id', component: DeleteCatplatoComponent },
  { path: 'delete-plato/:id', component: DeletePlatoComponent },
  { path: 'delete-inventario/:id', component: DeleteInventarioComponent },
  { path: 'delete-tipodeusuario/:id', component: DeletetipodeusuarioComponent },
  { path: 'delete-usuarios/:id', component: DeleteusuariosComponent },
  { path: 'delete-platos-ingredientes/:id', component: DeletePlatosIngredientesComponent },

  { path: 'show-chef', component: ShowChefComponent},
  { path: 'show-comanda/:id', component: ShowComandaComponent},
  { path: 'show-mesas/:id', component: ShowMesasComponent },
  { path: 'show-cajero', component: ShowCajeroComponent },
  { path: 'show-preparaciones', component: ShowPreparacionesComponent },
  { path: 'show-parrilla', component: ShowParrillaComponent },
  
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
