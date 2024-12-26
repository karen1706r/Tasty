import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { RestauranteService } from '../../services/restaurante.service'; // Importa el servicio para obtener los datos del usuario
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public usuario: any; // Propiedad para almacenar la información del usuario
    public userRole: number | null = null; // Propiedad para almacenar el rol del usuario
    public alertasInventario: any[] = []; // Para almacenar las alertas
    public isLoading: boolean = true; // Nueva propiedad para controlar el estado de carga

    constructor(
        public sidebarservice: SidebarService,
        private restauranteService: RestauranteService, // Inyecta el servicio
        private authService: AuthService,
        private inventarioComponent: RestauranteService, // Inyecta InventarioComponent
    ) { }

    ngOnInit(): void {
        // Obtener el sessionId del localStorage
        const sessionId = localStorage.getItem('sessionId');

        if (sessionId) {
            // Hacer una petición al servicio para obtener la sesión
            this.restauranteService.getSesion(+sessionId).subscribe({
                next: (sesionData) => {
                    

                    if (sesionData && sesionData.id_usuario) {
                        const userId = sesionData.id_usuario;

                        // Ahora, obtener los datos del usuario
                        this.restauranteService.getUsuario(userId).subscribe({
                            next: (usuarioData) => {
                                
                                this.usuario = usuarioData; // Guardar los datos del usuario para mostrarlos en la vista
                                this.userRole = usuarioData.id_tipo_usuario; // Asignar el rol del usuario utilizando el campo correcto
                                this.isLoading = false; // Marcar como completada la carga de datos
                            },
                            error: (error) => {
                                
                                this.isLoading = false; // Finalizar la carga incluso si hay un error
                            }
                        });
                    } else {
                        
                        this.isLoading = false; // Finalizar la carga si no se encuentra el usuario
                    }
                },
                error: (error) => {
                    
                    this.isLoading = false; // Finalizar la carga si hay un error en la obtención de sesión
                }
            });
        } else {
            
            this.isLoading = false; // Finalizar la carga si no se encuentra el sessionId
        }

        // Suscribirse a las alertas del inventario
        this.restauranteService.getAlertasInventario().subscribe({
            next: (alertas) => {
                this.alertasInventario = alertas;
            },
            error: (error) => {
                
            }
        });
    }

    // Método logout para cerrar sesión
    logout(): void {
        this.authService.logout(); // Llamar al método de logout del AuthService
    }

    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
    }

    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
    }

    // Métodos para verificar el rol del usuario
    isAdmin(): boolean {
        
        return this.userRole === 1 && !this.isLoading; // Verificar si el rol es el del administrador
    }

    isMesero(): boolean {
        return this.userRole === 2 && !this.isLoading;
    }

    isChef(): boolean {
        return this.userRole === 3 && !this.isLoading;
    }

    isCajero(): boolean {
        return this.userRole === 4 && !this.isLoading;
    }

    getDropdownMenuClass(): string {
        if (this.isAdmin()) {
            return 'dropdown-menu-admin'; // Clase especial para el admin que tiene más opciones
        }
        return 'dropdown-menu-normal'; // Clase para otros roles con menos opciones
    }

}
