import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-por-mesas',
  templateUrl: './pedidos-por-mesas.component.html',
  styleUrls: ['./pedidos-por-mesas.component.scss']
})
export class PedidosPorMesasComponent implements OnInit {
  pedidospormesas: FormGroup;
  categorias: any[] = [];
  platos: any[] = [];
  visualizarItems: any[] = [];
  ingredientes: any[] = [];
  ingredientesSeleccionados: any[] = [];
  ingredientesNoSeleccionadosIds: number[] = [];
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private pedidospormesasService: RestauranteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // Importado para forzar la actualización de vista
  ) {
    this.pedidospormesas = this.buildForm();
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { pedidos: any[] };

    if (state && state.pedidos) {
      this.visualizarItems = state.pedidos.map(pedido => ({
        id_plato: pedido.id_plato,
        id_categoria: pedido.id_categoria,
        plato: pedido.platos_model ? pedido.platos_model.nombre : 'Sin nombre',
        categoria: pedido.platos_model && pedido.platos_model.categorias_platos_model
          ? pedido.platos_model.categorias_platos_model.nombre_categoria
          : 'Sin categoría',
        cantidad: pedido.cantidad,
        comentarios: pedido.comentarios,
        isConfirmed: true
      }));
    }

    this.loadCategorias();

    const idMesa = this.route.snapshot.paramMap.get('id');
    if (idMesa) {
      this.pedidospormesas.get('id_mesa')?.setValue(idMesa);
      this.cargarPedidosConfirmados(idMesa);
    }
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      id_mesa: ['', Validators.required],
      id_plato: ['', Validators.required],
      id_categoria: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      comentarios: ['', Validators.required],
      fecha_hora: [new Date(), Validators.required],
      id_pedido: ['']
    });
  }

  private cargarPedidosConfirmados(idMesa: string): void {
    this.pedidospormesasService.obtenerPedidosPorMesa2(idMesa).subscribe(
      (pedidos) => {
        const pedidosActivos = pedidos.filter(pedido => pedido.estado_pedido);
        if (pedidosActivos.length === 0) {
          console.log(`No hay pedidos activos para la mesa ${idMesa}`);
          this.visualizarItems = [];
          return;
        }
        const itemsConfirmados = pedidosActivos.flatMap(pedido => {
          return pedido.pedidos_por_mesa_models.map(detalle => {
            const plato = detalle.platos_model ? detalle.platos_model : null;
            const categoria = plato && plato.categorias_platos_model
              ? plato.categorias_platos_model.nombre_categoria
              : 'Sin categoría';

            return {
              id_plato: detalle.id_plato,
              id_categoria: detalle.id_categoria,
              plato: plato ? plato.nombre : 'Sin nombre',
              categoria: categoria,
              cantidad: detalle.cantidad,
              comentarios: detalle.comentarios,
              isConfirmed: true
            };
          });
        });

        console.log('Items confirmados:', itemsConfirmados);
        this.visualizarItems = itemsConfirmados;
      },
      (error) => {
        console.error('Error al cargar los pedidos confirmados:', error);
      }
    );
  }

  addToVisualizar(): void {
    const selectedPlatoId = +this.pedidospormesas.value.id_plato;
    const selectedCategoriaId = +this.pedidospormesas.value.id_categoria;
    const cantidad = this.pedidospormesas.value.cantidad;
  
    if (!selectedCategoriaId) {
      Swal.fire('Error', 'Primero selecciona una categoría para poder agregar un plato.', 'error');
      return;
    }
  
    const selectedPlato = this.platos.find(plato => plato.id === selectedPlatoId);
  
    if (selectedPlato && cantidad > 0) {
      // Actualizamos el comentario antes de agregar el ítem
      const comentarios = this.pedidospormesas.value.comentarios || '';  // Usamos el valor del campo comentarios
  
      const item = {
        id_plato: selectedPlatoId,
        id_categoria: selectedCategoriaId,
        plato: selectedPlato.nombre,
        cantidad,
        comentarios,  // Comentarios directamente del formulario
        ingredientes: this.ingredientesSeleccionados,
        isConfirmed: false,
        totalIngredientes: this.calculateTotalIngredientes(selectedPlatoId, cantidad)
      };
  
      console.log('Item agregado a visualizar:', item);
  
      this.visualizarItems.push(item);
      this.pedidospormesas.reset({
        id_mesa: this.pedidospormesas.value.id_mesa
      });
  
      this.pedidospormesas.patchValue({
        id_plato: '',
        id_categoria: '',
        cantidad: '',
        comentarios: ''
      });
  
      this.ingredientesSeleccionados = [];
      this.ingredientes = [];
    } else {
      Swal.fire('Error', 'Selecciona todos los campos y asegúrate de que la cantidad sea mayor a 0', 'error');
    }
  }
  

  private calculateTotalIngredientes(platoId: number, cantidad: number): any {
    const totalIngredientes: any[] = [];

    this.pedidospormesasService.getIngredientesPlatoPedidos(platoId).subscribe(
        (ingredientes) => {
            console.log('Ingredientes recibidos desde el backend:', ingredientes);

            ingredientes.forEach(ingrediente => {
                const idIngrediente = ingrediente.ingredientes_model.id;

                // Verifica si el ingrediente está en la lista de no seleccionados por ID
                const estaSeleccionado = !this.ingredientesNoSeleccionadosIds.includes(idIngrediente);

                console.log(`Procesando ingrediente ID: ${idIngrediente}, seleccionado: ${estaSeleccionado}`);

                if (estaSeleccionado) {
                    const unidad = ingrediente.ingredientes_model.unidad;
                    const cantidadEnPlato = parseFloat(ingrediente.cantidad);
                    const cantidadUsada = unidad * cantidadEnPlato * cantidad;

                    console.log(`Calculando total para ingrediente ID: ${idIngrediente}`);
                    console.log(`Unidad: ${unidad}g, Cantidad en plato: ${cantidadEnPlato}, Cantidad de pedidos: ${cantidad}`);
                    console.log(`Total calculado: ${cantidadUsada}g`);

                    // Añadir el ingrediente al array en la estructura esperada
                    totalIngredientes.push({ id: idIngrediente, cantidad: cantidadUsada });
                } else {
                    console.log(`Ingrediente ID ${idIngrediente} no está seleccionado y será omitido en el cálculo.`);
                }
            });

            console.log('Array de ingredientes para actualizar inventario:', totalIngredientes);
            this.enviarActualizacionInventario(totalIngredientes);  // Llamada al método para actualizar el inventario
        },
        (error) => {
            console.error('Error al cargar los ingredientes del plato:', error);
        }
    );
  }

  private enviarActualizacionInventario(ingredientes: any[]): void {
    const payloadInventario = { ingredientes };
    console.log('Payload para actualizar inventario:', payloadInventario);

    this.pedidospormesasService.actualizarInventario(payloadInventario).subscribe(
        response => {
            console.log('Inventario actualizado exitosamente:', response);
        },
        error => {
            console.error('Error al actualizar el inventario:', error);
        }
    );
  }

  private loadCategorias(): void {
    this.pedidospormesasService.getcategoriasplatos().subscribe(
      (data: any) => {
        const categoriasConPlatosPromises = data
          .filter(categoria => categoria.estado)
          .map((categoria: any) =>
            this.pedidospormesasService.getPlatosPorCategoria(categoria.id).toPromise()
              .then((platos) => {
                const platosConIngredientesPromises = platos.map((plato: any) =>
                  this.pedidospormesasService.getIngredientesPlatoPedidos(plato.id).toPromise()
                    .then(ingredientes => ingredientes.length > 0 ? plato : null)
                    .catch(error => error.status === 404 ? null : Promise.reject(error))
                );

                return Promise.all(platosConIngredientesPromises)
                  .then(platosConIngredientes => {
                    return platosConIngredientes.some(plato => plato !== null) ? categoria : null;
                  });
              })
          );

        Promise.all(categoriasConPlatosPromises).then(categoriasFiltradas => {
          this.categorias = categoriasFiltradas.filter(categoria => categoria !== null);
        });
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
        Swal.fire('Error', 'No se pudieron cargar las categorías.', 'error');
      }
    );
  }

  private updateComentarios(): void {
    const ingredientesNoSeleccionados = this.ingredientes
      .filter(ingrediente => !ingrediente.marcado)
      .map(ingrediente => ingrediente.ingredientes_model.id);

    const nombresIngredientesNoSeleccionados = this.ingredientes
      .filter(ingrediente => !ingrediente.marcado)
      .map(ingrediente => ingrediente.ingredientes_model.nombre);

    const finalComentarios = nombresIngredientesNoSeleccionados.length === 0
      ? 'Ninguno'
      : `Sin: ${nombresIngredientesNoSeleccionados.join(', ')}`;

    this.pedidospormesas.patchValue({ comentarios: finalComentarios });
    console.log('Comentarios actualizados:', finalComentarios);

    this.ingredientesNoSeleccionadosIds = ingredientesNoSeleccionados;
  }

  loadPlatos(categoriaId: string) {
    this.pedidospormesasService.getPlatosPorCategoria(categoriaId).subscribe(
      (response) => {
        const platosConIngredientesPromises = response.map((plato: any) =>
          this.pedidospormesasService.getIngredientesPlatoPedidos(plato.id).toPromise()
            .then((ingredientes) => ingredientes.length > 0 ? plato : null)
            .catch((error) => {
              if (error.status === 404) {
                return null;
              } else {
                throw error;
              }
            })
        );

        Promise.all(platosConIngredientesPromises).then((platosConIngredientes) => {
          this.platos = platosConIngredientes.filter(plato => plato !== null);
        });
      },
      (error) => {
        console.error('Error al cargar los platos:', error);
        Swal.fire('Error', 'No se pudieron cargar los platos para esta categoría.', 'error');
      }
    );
  }

  onCategoriaChange(event: Event) {
    const selectedCategoriaId = (event.target as HTMLSelectElement).value;
    if (selectedCategoriaId) {
      this.loadPlatos(selectedCategoriaId);
      this.pedidospormesas.patchValue({
        id_plato: '',
        cantidad: '',
        comentarios: ''
      });
      this.ingredientes = [];
      this.ingredientesSeleccionados = [];
    } else {
      this.platos = [];
      this.pedidospormesas.get('id_plato')?.setValue('');
    }
  }

  onPlatoChange(event: any): void {
    const selectedPlatoId = +event.target.value;
    if (selectedPlatoId) {
      this.loadIngredientes(selectedPlatoId);
      this.ingredientesSeleccionados = [];
      this.pedidospormesas.patchValue({ cantidad: 1 });
    } else {
      this.ingredientes = [];
      this.ingredientesSeleccionados = [];
      this.pedidospormesas.patchValue({ comentarios: '', cantidad: '' });
    }
  }

  loadIngredientes(platoId: number) {
    this.pedidospormesasService.getIngredientesPlatoPedidos(platoId).subscribe(
      (response) => {
        this.ingredientes = response.map(ingrediente => ({
          ...ingrediente,
          marcado: true
        }));
        console.log('Ingredientes cargados con la propiedad marcado:', this.ingredientes);
      },
      (error) => {
        console.error('Error al cargar los ingredientes:', error);
        Swal.fire('Error', 'No se pudieron cargar los ingredientes para este plato.', 'error');
      }
    );
  }

  onIngredientChange(event: Event, ingrediente: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    ingrediente.marcado = isChecked;

    if (isChecked) {
      this.ingredientesSeleccionados.push(ingrediente.id);
    } else {
      this.ingredientesSeleccionados = this.ingredientesSeleccionados.filter(id => id !== ingrediente.id);
    }
    this.updateComentarios();
  }

  save(): void {
    const idMesa = this.pedidospormesas.get('id_mesa')?.value;
  
    if (!idMesa) {
      Swal.fire('Error', 'No se ha especificado un id de mesa válido.', 'error');
      return;
    }
  
    const itemsToConfirm = this.visualizarItems.filter(item => !item.isConfirmed);
  
    if (itemsToConfirm.length === 0) {
      Swal.fire('Error', 'No hay elementos nuevos en el pedido para guardar.', 'error');
      return;
    }
  
    // Obtener el id_usuario del localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire('Error', 'No se ha encontrado un usuario activo. Inicia sesión de nuevo.', 'error');
      return;
    }
  
    // Agregar el id_usuario al nuevo pedido
    const nuevoPedido = {
      id_mesa: idMesa,
      id_usuario: parseInt(userId),
      fecha: new Date().toISOString(),
      estado_pedido: true,
      estados_p: true
    };
  
    console.log('Datos del pedido a enviar:', nuevoPedido);
  
    this.pedidospormesasService.crearPedido(nuevoPedido).subscribe(
      (pedidoCreado) => {
        Swal.fire('Éxito', 'Pedido registrado correctamente.', 'success');
        console.log('Nuevo pedido creado en la base de datos:', pedidoCreado);
  
        const idPedido = pedidoCreado.id;
        let ingredientesParaActualizar: any[] = [];
  
        itemsToConfirm.forEach(item => {
          // Agregar los ingredientes necesarios para actualizar el inventario
          const totalIngredientes = this.calculateTotalIngredientes(item.id_plato, item.cantidad);
          ingredientesParaActualizar = ingredientesParaActualizar.concat(totalIngredientes);
  
          // Marcar el item como confirmado antes de guardar en pedidos_por_mesa
          item.isConfirmed = true;
  
          const pedidoPorMesa = {
            id_pedido: idPedido,
            id_plato: item.id_plato,
            cantidad: item.cantidad,
            id_categoria: item.id_categoria,
            comentarios: JSON.stringify(item.comentarios),  // Aquí los comentarios se envían tal cual
            fecha_hora: new Date().toISOString()
          };
  
          console.log('Guardando item en pedidos_por_mesa:', pedidoPorMesa);
  
          this.pedidospormesasService.addPedidoPorMesa(pedidoPorMesa).subscribe(
            response => {
              console.log('Item guardado en pedidos_por_mesa:', response);
            },
            error => {
              console.error('Error al guardar item en pedidos_por_mesa:', error);
            }
          );
        });
  
        // Actualizar el inventario después de guardar todos los items en pedidos_por_mesa
        if (ingredientesParaActualizar.length > 0) {
          this.pedidospormesasService.actualizarInventario({ ingredientes: ingredientesParaActualizar }).subscribe(
            response => {
              console.log('Inventario actualizado:', response);
            },
            error => {
              console.error('Error al actualizar el inventario:', error);
            }
          );
        }
  
        // Limpiar solo el formulario de entrada
        this.pedidospormesas.reset({
          id_mesa: idMesa
        });
        this.isSubmitted = false;
  
        this.pedidospormesasService.notificarNuevoPedido();
  
        this.router.navigate(['dashboard/show-mesero']);
      },
      (error) => {
        Swal.fire('Error', 'Ocurrió un error al crear el pedido', 'error');
        console.error('Error al crear el pedido:', error);
      }
    );
  }
 
  
  
  

  eliminarItem(index: number): void {
    const item = this.visualizarItems[index];
    if (item.isConfirmed) {
      Swal.fire('Error', 'No se puede eliminar un item de un pedido ya confirmado.', 'error');
    } else {
      this.visualizarItems.splice(index, 1);
      Swal.fire('Éxito', 'El item ha sido eliminado.', 'success');
    }
  }
}
