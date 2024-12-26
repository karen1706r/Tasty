import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, pipe } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { response } from 'express';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'url'; // Define la URL base de tu API aquí

    constructor(private http: HttpClient, private router: Router) { }

    // Método para iniciar sesión
    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
            tap((response: any) => {
                console.log('Respuesta del servidor:', response); // Verificar la respuesta completa del servidor

                if (response && response.token) {
                    // Guardar el token en localStorage
                    localStorage.setItem('token', response.token);
                    console.log('Token guardado:', localStorage.getItem('token'));

                    // Intentar guardar el sessionId si está presente
                    if (response.sessionId) {
                        try {
                            localStorage.setItem('sessionId', response.sessionId.toString());
                            console.log('sessionId guardado en localStorage:', localStorage.getItem('sessionId'));
                        } catch (e) {
                            console.error('Error al intentar guardar el sessionId en localStorage:', e);
                        }
                    } else {
                        console.warn('No se recibió un sessionId en la respuesta del servidor');
                    }
                } else {
                    console.error('No se recibió un token en la respuesta del servidor');
                }
            }),
            catchError((error) => {
                console.error('Error en la solicitud de login:', error);
                return of(null); // Devolver un observable vacío para evitar romper el flujo
            })
        );
    }

    IdPedido(): Observable<any> {
        return this.http.get(`${this.apiUrl}/pedidos`).pipe(
            tap((response: any) => {
                console.log('Id_pedido:', localStorage.getItem('id'));
                localStorage.getItem('id')
            })
        )

    }

    // Método para redirigir al usuario basado en su rol
    redirectUser(userRole: number): void {
        switch (userRole) {
            case 1: // Administrador
                this.router.navigate(['/dashboard']);
                break;
            case 2: // Mesero
                this.router.navigate(['/dashboard/show-mesero']);
                break;
            case 4: // Chef
                this.router.navigate(['/dashboard/show-preparaciones']);
                break;
            case 5: // Cajero
                this.router.navigate(['/dashboard/show-cajero']);
                break;
            default:
                this.router.navigate(['/login']);
        }
    }

    // Método logout para cerrar sesión
    logout(): void {
        // Eliminar los datos del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('sessionId');

        console.log('Sesión cerrada, token y sessionId eliminados');

        // Redirigir al usuario a la página de login
        this.router.navigate(['/login']);
    }

    // Método para comprobar si el usuario está autenticado
    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token; // Devuelve true si hay un token, false de lo contrario
    }

    // Método para obtener el ID del usuario autenticado
    getUserId(): number | null {
        const userId = localStorage.getItem('userId');
        return userId ? parseInt(userId, 10) : null;
    }

    // Método para obtener el rol del usuario autenticado
    getUserRole(): number | null {
        const userRoleId = localStorage.getItem('userRoleId');
        return userRoleId ? parseInt(userRoleId, 10) : null;
    }
}
