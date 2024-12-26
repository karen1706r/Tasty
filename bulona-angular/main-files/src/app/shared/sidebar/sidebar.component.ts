import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { SidebarService } from "./sidebar.service";
import * as $ from 'jquery';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    public menuItems: any[];
    public userRole: number;
    public userRoleName: string;

    constructor(public sidebarservice: SidebarService, private router: Router) {
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
            }

            if (event instanceof NavigationEnd && $(window).width() < 1025 && (document.readyState === 'complete' || false)) {
                this.toggleSidebar(); // Ocultar sidebar automáticamente en dispositivos móviles
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator
                // Present error to user
                console.log(event.error);
            }
        });

        // Inicializar el estado del sidebar según el rol del usuario
        this.sidebarservice.setSidebarState(this.shouldStartCollapsed());
    }

    ngOnInit() {
        // Obtener el rol del usuario desde localStorage
        const storedRole = localStorage.getItem('userRoleId');
        this.userRole = storedRole ? parseInt(storedRole, 10) : null;

        // Obtener el nombre del rol según el userRole
        this.userRoleName = this.getRoleName(this.userRole);

        // Filtrar los elementos del menú según el rol del usuario
        this.menuItems = ROUTES.filter(menuItem => this.isMenuItemAllowed(menuItem));

        // Ocultar el sidebar si debería empezar colapsado
        if (this.shouldStartCollapsed()) {
            this.hideSidebar();
        }

        // Cargar el script del sidebar (por si es necesario para efectos visuales)
        $.getScript('./assets/js/app-sidebar.js');
    }

    // Método para verificar si el sidebar debe estar colapsado al inicio
    shouldStartCollapsed(): boolean {
        return this.userRole === 2 || this.userRole === 4 || this.userRole === 5;
    }

    // Método para verificar si un elemento del menú está permitido para el rol actual
    isMenuItemAllowed(menuItem: any): boolean {
        if (!this.userRole) {
            return false; // Si no hay rol definido, no mostrar ningún elemento
        }

        // Si el rol del usuario es Administrador, tiene acceso a todo
        if (this.userRole === 1) {
            return true;
        }

        // Si no se especifica la propiedad `role`, el elemento está disponible para todos los roles
        if (!menuItem.role) {
            return true;
        }

        // Verifica si el rol del usuario coincide con el `role` especificado en el menú
        return menuItem.role === this.userRole;
    }

    // Método para verificar si el rol del usuario es Administrador
    isAdmin(): boolean {
        return this.userRole === 1;
    }


    // Método para obtener la clase CSS del encabezado del sidebar según el rol del usuario
    getHeaderClass(): string {
        if (!this.isAdmin()) {
            return 'role-gradient';
        }
        return '';
    }


    // Obtener la clase CSS del sidebar según el rol del usuario
    getSidebarClass(): string {
        if (this.shouldStartCollapsed()) {
            return 'nav-collapsed role-gradient';
        }
        return '';
    }

    // Alternar el estado del sidebar entre colapsado y expandido
    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());

        if ($(".wrapper").hasClass("nav-collapsed")) {
            // Mostrar el sidebar si está colapsado
            $(".wrapper").removeClass("nav-collapsed");
        } else {
            // Colapsar el sidebar si está visible
            $(".wrapper").addClass("nav-collapsed");
        }
    }

    // Ocultar el sidebar (sin alternar)
    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
        $(".wrapper").addClass("nav-collapsed");
    }

    // Método para obtener el nombre del rol según el userRole
    getRoleName(role: number): string {
        switch (role) {
            case 1:
                return 'Administrador';
            case 2:
                return 'Mesero';
            case 4:
                return 'Chef';
            case 5:
                return 'Cajero';
            default:
                return 'Desconocido';
        }
    }
}