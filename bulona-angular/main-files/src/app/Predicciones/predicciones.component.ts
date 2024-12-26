import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RestauranteService } from '../services/restaurante.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-predicciones',
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.scss']

})

export class PrediccionesComponent implements OnInit, AfterViewInit {
  predicciones: any[] = [];
  ventasPorCategoria: any[] = [];
  ventasTotales: any[] = [];
  categoriasConColores: { nombre: string, color: string }[] = [];
  categoriasConColoresPrediccion: { nombre: string, color: string }[] = []
  charts: { [key: string]: Chart } = {};
  mostrarGraficasInformativas: boolean = false;
  mostrarGraficaAnalisisGeneral: boolean = false;
  mostrarGraficaPredictiva: boolean = false;

  constructor(
    private predictSalesService: RestauranteService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerPrediccionesFiltradas('AnalisisGeneralCategorias');
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  obtenerResumenVentas(): void {
    this.predictSalesService.getSalesSummary().subscribe(
      (data) => {
        console.log('Resumen de ventas recibido:', data);
        if (Array.isArray(data) && data.length > 0) {
          this.ventasPorCategoria = data;

          if (this.mostrarGraficasInformativas) {
            this.cdr.detectChanges();
            this.actualizarGraficoVentas();
          }
        } else {
          console.warn('No se recibieron datos o no son un array válido');
          this.ventasPorCategoria = [];
        }
      },
      (error) => {
        console.error('Error al obtener el resumen de ventas', error);
      }
    );
  }

  obtenerAnalisisGeneral(): void {
    this.predictSalesService.getSalesSummary().subscribe(
      (data) => {
        console.log('Datos del análisis general recibidos:', data);
        if (Array.isArray(data) && data.length > 0) {
          this.ventasTotales = data;
          this.mostrarGraficaAnalisisGeneral = true;
          this.mostrarGraficasInformativas = false;
          this.actualizarGraficoAnalisisGeneral();
        } else {
          console.warn('No se recibieron datos o no son un array válido');
          this.ventasTotales = [];
        }
      },
      (error) => {
        console.error('Error al obtener el análisis general', error);
      }
    );
  }

  agruparPorCategoria(data: any[], isPrediction: boolean): void {
    const categorias = new Map();

    data.forEach((item) => {
      if (!item.categoria) {
        console.warn('Categoría no definida para el item:', item);
        return;
      }

      const categoria = item.categoria;

      if (!categorias.has(categoria)) {
        categorias.set(categoria, {
          nombre: categoria,
          platos: [],
          totalVentas: 0,
        });
      }

      const categoriaData = categorias.get(categoria);
      categoriaData.platos.push({
        nombre: item.plato,
        precio: item.precio,
        total_ingresos: item.total_ingresos,
        total_ventas: isPrediction ? item.yhat : item.total_ventas,
      });
      categoriaData.totalVentas += isPrediction ? item.yhat : item.total_ventas;
    });

    this.ventasPorCategoria = Array.from(categorias.values());
    console.log('Categorías agrupadas:', this.ventasPorCategoria);
    if (this.mostrarGraficasInformativas) {
      this.cdr.detectChanges();
      this.actualizarGraficoVentas();
    }
  }

  getCanvasId(categoria: string, plato: string, index: number): string {
    const categoriaId = categoria ? categoria.toLowerCase().replace(/ /g, '_') : 'sin_categoria';
    const platoId = plato ? plato.toLowerCase().replace(/ /g, '_') : 'sin_plato';
    return `chart-${categoriaId}-${platoId}-${index}`;
  }

  actualizarGraficoVentas(): void {
    Object.keys(this.charts).forEach((key) => {
      if (key.startsWith('ventas') && this.charts[key]) {
        this.charts[key].destroy();
      }
    });

    this.ventasPorCategoria.forEach((categoria, catIndex) => {
      categoria.platos.forEach((plato, platoIndex) => {
        const canvasId = this.getCanvasId(categoria.nombre, plato.nombre, platoIndex); // Cambiado a plato.nombre
        const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;

        if (!canvasElement) {
          console.warn(`No se encontró el canvas para la categoría: ${categoria.nombre}, plato: ${plato.nombre}`);
          return;
        }

        const labels = ['Inicio', 'Ventas'];
        const data = [0, plato.total_ventas];

        const gradient = canvasElement.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
        if (gradient) {
          gradient.addColorStop(0, 'rgba(0, 123, 255, 0.4)');
          gradient.addColorStop(1, 'rgba(0, 123, 255, 0)');
        }

        const chartKey = `ventas-${canvasId}`;
        this.charts[chartKey] = new Chart(canvasElement, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: '',
                data: data,
                borderColor: 'rgba(0, 123, 255, 1)',
                backgroundColor: gradient || 'rgba(0, 123, 255, 0.2)',
                borderWidth: 2,
                tension: plato.total_ventas > 1 ? 0.4 : 0,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(0, 114, 255, 0.85)',
                bodyColor: '#fff',
                titleColor: '#fff',
                padding: 12,
                cornerRadius: 10,
                boxPadding: 8,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
                beginAtZero: true,
              },
            },
            elements: {
              line: {
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
              },
            },
            layout: {
              padding: {
                left: 5,
                right: 5,
                top: 10,
                bottom: 10,
              },
            },
          },
        });
      });
    });
  }


  obtenerPrediccionesFiltradas(diaSemana: string): void {
    Object.keys(this.charts).forEach((key) => {
      if (key.startsWith('prediccion') && this.charts[key]) {
        this.charts[key].destroy();
      }
    });

    this.charts = {};

    if (diaSemana === 'AnalisisGeneralCategorias') {
      this.mostrarGraficasInformativas = true;
      this.mostrarGraficaAnalisisGeneral = false;
      this.mostrarGraficaPredictiva = false;
      this.obtenerResumenVentas();
    } else if (diaSemana === 'general') {
      this.mostrarGraficasInformativas = false;
      this.mostrarGraficaAnalisisGeneral = true;
      this.mostrarGraficaPredictiva = false;
      this.obtenerAnalisisGeneral();
    } else {
      this.mostrarGraficasInformativas = false;
      this.mostrarGraficaAnalisisGeneral = false;
      this.mostrarGraficaPredictiva = true;

      const diaSemanaMap = {
        'Lunes': 1,
        'Martes': 2,
        'Miércoles': 3,
        'Jueves': 4,
        'Viernes': 5,
        'Sábado': 6,
        'Domingo': 0
      };

      const diaSeleccionado = diaSemanaMap[diaSemana];

      this.predictSalesService.getPredictions().subscribe(
        (data) => {
          const prediccionesFiltradas = data.filter((prediccion) => {
            const fecha = new Date(prediccion.ds);
            return fecha.getDay() === diaSeleccionado;
          });

          if (prediccionesFiltradas.length === 0) {
            console.warn('No hay datos para mostrar en el gráfico después del filtrado.');
          }

          // Agrupar predicciones por plato para evitar duplicados
          const prediccionesAgrupadas: { [key: string]: any } = {};
          prediccionesFiltradas.forEach((prediccion) => {
            if (!prediccionesAgrupadas[prediccion.plato]) {
              prediccionesAgrupadas[prediccion.plato] = {
                plato: prediccion.plato,
                yhat: prediccion.yhat,
                categoria: prediccion.categoria
              };
            } else {
              prediccionesAgrupadas[prediccion.plato].yhat += prediccion.yhat;
            }
          });

          // Convertir el objeto agrupado a un array
          this.predicciones = Object.values(prediccionesAgrupadas);

          this.actualizarGraficoPredicciones();
        },
        (error) => {
          console.error('Error al obtener las predicciones', error);
        }
      );
    }
  }

  actualizarGraficoPredicciones(): void {
    const canvasElement = document.getElementById('graficoVentas') as HTMLCanvasElement;

    if (this.charts['prediccion-graficoVentas']) {
      this.charts['prediccion-graficoVentas'].destroy();
    }

    if (canvasElement && this.predicciones.length > 0) {
      const labels: string[] = [];
      const data: number[] = [];
      const backgroundColors: string[] = [];
      const categoriasConColores: { nombre: string; color: string }[] = [];

      const colors = [
        'rgba(0, 123, 255, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ];

      this.predicciones.forEach((prediccion, index) => {
        let existingCategoria = categoriasConColores.find(c => c.nombre === prediccion.categoria);
        if (!existingCategoria) {
          const categoriaColor = colors[categoriasConColores.length % colors.length];
          existingCategoria = { nombre: prediccion.categoria, color: categoriaColor };
          categoriasConColores.push(existingCategoria);
        }

        labels.push(prediccion.plato);
        data.push(prediccion.yhat);
        backgroundColors.push(existingCategoria.color);
      });

      this.categoriasConColoresPrediccion = categoriasConColores;

      // Reset categories to force reload if necessary
      if (!this.categoriasConColoresPrediccion.length) {
        this.categoriasConColoresPrediccion = [...categoriasConColores];
      }

      this.charts['prediccion-graficoVentas'] = new Chart(canvasElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Predicción de Ventas por Plato',
              data: data,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
              borderWidth: 2,
              barPercentage: 0.6,
              categoryPercentage: 0.8,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            x: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
            },
          },
          layout: {
            padding: {
              bottom: 40,
              top: 10,
            },
          },
        },
      });
    }
  }



  actualizarGraficoAnalisisGeneral(): void {
    const canvasElement = document.getElementById('graficoAnalisisGeneral') as HTMLCanvasElement;

    if (this.charts['graficoAnalisisGeneral']) {
      this.charts['graficoAnalisisGeneral'].destroy();
    }

    if (canvasElement && this.ventasTotales.length > 0) {
      const labels: string[] = [];
      const data: number[] = [];
      const backgroundColors: string[] = [];
      const categoriasConColores: { nombre: string; color: string }[] = [];

      const colors = [
        'rgba(0, 123, 255, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ];

      this.ventasTotales.forEach((categoria, index) => {
        const categoriaColor = colors[index % colors.length];
        categoriasConColores.push({ nombre: categoria.nombre, color: categoriaColor });

        if (categoria.platos && Array.isArray(categoria.platos)) {
          categoria.platos.forEach((plato) => {
            if (plato.plato) {
              labels.push(plato.plato);
              data.push(plato.total_ingresos || 0);
              backgroundColors.push(categoriaColor);
            } else {
              console.warn('El nombre del plato no está definido para:', plato);
            }
          });
        } else {
          console.warn('No se encontraron platos en la categoría:', categoria);
        }
      });

      this.categoriasConColores = categoriasConColores;

      this.charts['graficoAnalisisGeneral'] = new Chart(canvasElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ingresos Totales por Plato',
              data: data,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
              borderWidth: 2,
              barPercentage: 0.6,
              categoryPercentage: 0.8,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            x: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
            },
          },
          layout: {
            padding: {
              bottom: 40,
              top: 10,
            },
          },
        },
      });
    }
  }
}
