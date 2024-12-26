import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarService } from '../../shared/sidebar/sidebar.service';

@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent implements OnInit {
    sidebarState: boolean; // Variable para almacenar el estado del sidebar

    constructor(
        public sidebarservice: SidebarService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarState);
        this.sidebarState = this.sidebarservice.getSidebarState();
        this.cdr.detectChanges();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
        this.sidebarState = this.sidebarservice.getSidebarState();
    }

    ngOnInit() {
        // Inicializa el estado del sidebar
        this.sidebarState = this.sidebarservice.getSidebarState();

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }
}
