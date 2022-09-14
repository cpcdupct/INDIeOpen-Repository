import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services';

/**
 * Guard for checking if the user is logged in
 */
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    /**
     * Checks if the current user is logged in and returns it. If not logged in, then redirect to the main page
     *
     * @param next ActivatedRouteSnapshot
     * @param state RouterStateSnapshot
     */
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/explore'], {
                queryParams: {
                    forbidden: 'true',
                },
            });
            return false;
        }

        return true;
    }
}
