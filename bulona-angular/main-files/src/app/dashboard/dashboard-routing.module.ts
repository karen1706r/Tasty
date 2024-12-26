import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { DigitalMarketingComponent } from './digital-marketing/digital-marketing.component';
import { HumanResourcesComponent } from './human-resources/human-resources.component';

import { CategoriasInventarioComponent } from '../acomponent/categorias-inventario/categorias-inventario.component';
import { CategoriasplatosComponent } from '../acomponent/categorias-platos/categorias-platos.component';
import { MesasComponent } from '../acomponent/mesas/mesas.component';
import { IngredientesComponent } from '../acomponent/ingredientes/ingredientes.component';
import { PlatosComponent } from '../acomponent/platos/platos.component';
import { InventarioComponent } from '../acomponent/inventario/inventario.component';
import { TipodeusuarioComponent } from '../acomponent/tipos-de-usuario/tipos-de-usuario.component';
import { usuariosComponent } from '../acomponent/usuarios/usuarios.component';
import { PlatosIngredientesComponent } from '../acomponent/platos-ingredientes/platos-ingredientes.component';
import { PedidosPorMesasComponent } from '../acomponent/pedidos-por-mesas/pedidos-por-mesas.component';


import { AddIngredientesComponent } from '../add/add-ingredientes/add-ingredientes.component';
import { AddCatinventarioComponent } from '../add/add-catinventario/add-catinventario.component';
import { AddMesasComponent } from '../add/add-mesas/add-mesas.component';
import { AddCatplatosComponent } from '../add/add-catplato/add-catplato.component';
import { AddPlatoComponent } from '../add/add-plato/add-plato.component';
import { AddInventarioComponent } from '../add/add-inventario/add-inventario.component';
import { AddtipodeusuarioComponent } from '../add/add-tipodeusuario/add-tipodeusuario.component';
import { AddusuariosComponent } from '../add/add-usuarios/add-usuarios.component';
import { AddPlatosIngredientesComponent } from '../add/add-platos-ingredientes/add-platos-ingredientes.component';

  

import { UpdateCatinventarioComponent } from '../update/update-catinventario/update-catinventario.component';
import { UpdateMesasComponent } from '../update/update-mesas/update-mesas.component';
import { UpdateIngredientesComponent } from '../update/update-ingredientes/update-ingredientes.component';
import { UpdateCatplatoComponent } from '../update/update-catplato/update-catplato.component';
import { UpdatePlatoComponent } from '../update/update-plato/update-plato.component';
import { UpdateInventarioComponent } from '../update/update-inventario/update-inventario.component';
import { UpdatetipodeusuarioComponent } from '../update/update-tipodeusuario/update-tipodeusuario.component';
import { UpdateusuarioComponent } from '../update/update-usuarios/update-usuarios.component';
import { UpdatePlatosIngredientesComponent } from '../update/update-platos-ingredientes/update-platos-ingredientes.component';


import { DeleteCatinventarioComponent } from '../delete/delete-catinventario/delete-catinventario.component';
import { DeleteMesasComponent } from '../delete/delete-mesas/delete-mesas.component';
import { DeleteIngredientesComponent } from '../delete/delete-ingredientes/delete-ingredientes.component';
import { DeleteCatplatoComponent } from '../delete/delete-catplato/delete-catplato.component';
import { DeletePlatoComponent } from '../delete/delete-plato/delete-plato.component';
import { DeleteInventarioComponent } from '../delete/delete-inventario/delete-inventario.component';
import { DeletetipodeusuarioComponent } from '../delete/delete-tipodeusuario/delete-tipodeusuario.component';
import { DeleteusuariosComponent } from '../delete/delete-usuarios/delete-usuarios.component';
import { DeletePlatosIngredientesComponent } from '../delete/delete-platos-ingredientes/delete-platos-ingredientes.component';


import { ShowMesasComponent } from '../show/show-mesas/show-mesas.component';
import { ShowMeseroComponent } from '../show/show-mesero/show-mesero.component';
import { ShowChefComponent } from '../show/show-chef/show-chef.component';
import { ShowComandaComponent } from '../show/show-comanda/show-comanda.component';
import { ShowCajeroComponent } from '../show/show-cajero/show-cajero.component';
import { ShowPreparacionesComponent } from '../show/show-preparaciones/show-preparaciones.component';
import { ShowParrillaComponent } from '../show/show-parrilla/show-parrilla.component';
import { FacturasComponent } from '../acomponent/facturas/facturas.component';



import { PrediccionesComponent } from '../Predicciones/predicciones.component';


const routes: Routes = [
  {
    path: '',
    children: [


      {
        path: 'Predicciones',
        component: PrediccionesComponent,
        data: {
          title: 'Predicciones'
        }
      },

      //Facturaaa-----------------------------------------------------------------------


    {
      path: 'show-parrilla',
      component: ShowParrillaComponent,
      data: {
        title: 'show-parrilla'
      }
    },
    {
      path: 'show-preparaciones',
      component: ShowPreparacionesComponent,
      data: {
        title: 'show-preparaciones'
      }
    },
    {
      path: 'show-cajero',
      component: ShowCajeroComponent,
      data: {
        title: 'show-cajero'
      }
    },
    {
      path: 'factura/:idMesa',
      component: FacturasComponent,
      data: {
        title: 'factura'
      }
    },


      //chef---comanda---------------------------------------------------------------------
      {
        path: 'show-chef',
        component: ShowChefComponent,
        data: {
          title: 'show-chef'
        }
      },
      {
        path: 'show-comanda/:id',
        component: ShowComandaComponent,
        data: {
          title: 'show-comanda/:id'
        }
      },
      //Pedidos por mesa ----------------------------------------------------
      {
        path: 'pedidos-por-mesas/:id',
        component: PedidosPorMesasComponent,
        data: {
          title: 'pedidos-por-mesas'
        }
      },
      
      //Mesero--------------------------------------------------------
      {
        path: 'show-mesero',
        component: ShowMeseroComponent,
        data: {
          title: 'show-mesero'
        }
      },
      

      //Cat inventario ------------------------------------------------------------------
      {
        path: 'categorias-inventario',
        component: CategoriasInventarioComponent,
        data: {
          title: 'categorias-inventario'
        }
      },

      {
        path: 'add-catinventario',
        component: AddCatinventarioComponent,
        data: {
          title: 'Categoria inventario'
        }
      },

      {
        path: 'update-catinventario/:id',
        component: UpdateCatinventarioComponent,
        data: {
          title: 'Categoria inventario'
        }
      },

      {
        path: 'delete-catinventario/:id',
        component: DeleteCatinventarioComponent,
        data: {
          title: 'Categoria inventario'
        }
      },

      // Mesas ------------------------------------------------------------
      {
        path: 'mesas',
        component: MesasComponent,
        data: {
          title: 'Mesas'
        }
      },

      {
        path: 'add-mesas',
        component: AddMesasComponent,
        data: {
          title: 'Mesas'
        }
      },

      {
        path: 'update-mesas/:id',
        component: UpdateMesasComponent,
        data: {
          title: 'Mesas'
        }
      },

      {
        path: 'delete-mesas/:id',
        component: DeleteMesasComponent,
        data: {
          title: 'Mesas'
        }
      },

      {
        path: 'show-mesas/:id',
        component: ShowMesasComponent,
        data: {
          title: 'Mesas'
        }
      },


      //Ingredientes ---------------------------------------------------------------------
      {
        path: 'ingredientes',
        component: IngredientesComponent,
        data: {
          title: 'Ingredientes'
        }
      },

      {
        path: 'add-ingredientes',
        component: AddIngredientesComponent,
        data: {
          title: 'Ingredientes'
        }
      },

      {
        path: 'update-ingredientes/:id',
        component: UpdateIngredientesComponent,
        data: {
          title: 'Ingredientes'
        }
      },

      {
        path: 'delete-ingredientes/:id',
        component: DeleteIngredientesComponent,
        data: {
          title: 'Ingredientes'
        }
      },

      //Catplatos -------------------------------------------------------------------------


      {
        path: 'categorias-platos',
        component: CategoriasplatosComponent,
        data: {
          title: 'categorias-inventario'
        }
      },
      {
        path: 'add-catplato',
        component: AddCatplatosComponent,
        data: {
          title: 'Categoria plato'
        }
      },
      {
        path: 'update-catplato/:id',
        component: UpdateCatplatoComponent,
        data: {
          title: 'Categoria plato'
        }
      },
      {
        path: 'delete-catplato/:id',
        component: DeleteCatplatoComponent,
        data: {
          title: 'Categoria plato'
        }
      },


      //platos ------------------------------------------------------------- 
      {
        path: 'platos',
        component: PlatosComponent,
        data: {
          title: 'platos'
        }
      },

      {
        path: 'add-plato',
        component: AddPlatoComponent,
        data: {
          title: 'platos'
        }
      },


      {
        path: 'update-plato/:id',
        component: UpdatePlatoComponent,
        data: {
          title: 'platos'
        }
      },

      {
        path: 'delete-plato/:id',
        component: DeletePlatoComponent,
        data: {
          title: 'plato'
        }
      },


      //Inventario -------------------------------------------------------
      {
        path: 'inventario',
        component: InventarioComponent,
        data: {
          title: 'Inventario'
        }
      },


      {
        path: 'add-inventario',
        component: AddInventarioComponent,
        data: {
          title: 'Inventario'
        }
      },

      {
        path: 'update-inventario/:id',
        component: UpdateInventarioComponent,
        data: {
          title: 'Inventario'
        }
      },

      {
        path: 'delete-inventario/:id',
        component: DeleteInventarioComponent,
        data: {
          title: 'Inventario'
        }
      },

      // Tipos de usuario ----------------------------------------------------------

      {
        path: 'tipos_de_usuario',
        component: TipodeusuarioComponent,
        data: {
          title: 'tipos_de_usuario'
        }
      },
      {
        path: 'add-tipodeusuario',
        component: AddtipodeusuarioComponent,
        data: {
          title: 'tipo de usuario'
        }
      },
      {
        path: 'update-tipodeusuario/:id',
        component: UpdatetipodeusuarioComponent,
        data: {
          title: 'tipo de usuario'
        }
      },
      {
        path: 'delete-tipodeusuario/:id',
        component: DeletetipodeusuarioComponent,
        data: {
          title: 'tipo de usuario'
        }
      },


      // Usuarios ---------------------------------------------------------
      {
        path: 'usuarios',
        component: usuariosComponent,
        data: {
          title: 'usuarios'
        }
      },
      {
        path: 'add-usuarios',
        component: AddusuariosComponent,
        data: {
          title: 'usuarios'
        }
      },
      {
        path: 'update-usuarios/:id',
        component: UpdateusuarioComponent,
        data: {
          title: 'usuario'
        }
      },
      {
        path: 'delete-usuario/:id',
        component: DeleteusuariosComponent,
        data: {
          title: 'usuarios'
        }
      },

      // Platos ingrediente
      {
        path: 'platos-ingredientes',
        component: PlatosIngredientesComponent,
        data: {
          title: 'Platos-ingredientes'
        }
      },


      {
        path: 'add-platos-ingredientes',
        component: AddPlatosIngredientesComponent,
        data: {
          title: 'Platos-ingredientes'
        }
      },

      {
        path: 'update-platos-ingredientes/:id',
        component: UpdatePlatosIngredientesComponent,
        data: {
          title: 'Platos-ingredientes'
        }
      },

      {
        path: 'delete-platos-ingredientes/:id',
        component: DeletePlatosIngredientesComponent,
        data: {
          title: 'Platos-ingredientes'
        }
      },


      //-----------------------------------------------------------------------


      {
        path: 'e-commerce',
        component: ECommerceComponent,
        data: {
          title: 'e-Commerce'
        }
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        data: {
          title: 'Analytics'
        }
      },
      {
        path: 'digital-marketing',
        component: DigitalMarketingComponent,
        data: {
          title: 'Digital Marketing'
        }
      },
      {
        path: 'human-resources',
        component: HumanResourcesComponent,
        data: {
          title: 'Human Resources'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
