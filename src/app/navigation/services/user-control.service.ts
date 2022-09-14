import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, Language } from '@core/models';
import { ApiService, AuthService, TenantService } from '@core/services';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

import { LoginBean } from '../models';

/**
 * Service that handle all the authentication between the application and the web api
 */
@Injectable({
    providedIn: 'root',
})
export class UserControlService {
    constructor(
        private api: ApiService,
        private authService: AuthService,
        private tenantService: TenantService
    ) {}

    /**
     * Send a login request with a LoginBean containing the user login information
     *
     * @param loginBean Login bean with user and password
     */
    doLogin(loginBean: LoginBean): Observable<AuthResponse> {
        const data = `username=${loginBean.username}&password=${loginBean.password}&grant_type=password`;

        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        headers = headers.set(
            'Authorization',
            'Basic ' + btoa(`${environment.app_client}:${environment.app_password}`)
        );

        const url = this.tenantService.getCurrentTenant().loginEndpoint;
        return this.api.postWithHeadersAndFullURL<AuthResponse>(url, data, headers, false);
    }

    /**
     * Request that handles the success response from the web api that set the current user in the application
     *
     * @param response AuthResponse
     */
    loginSuccessful(response: AuthResponse) {
        this.authService.setCurrentUser({
            access_token: response.access_token,
            completeName: response.nombre + ' ' + response.apellido,
            id: response.id,
            refresh_token: response.refresh_token,
            username: response.correo,
            avatar: response.avatar,
        });
    }

    /**
     * Send a reset password request for reseting the password in the user
     *
     * @param email User email
     * @param language Language key
     */
    requestResetPassword(email: string, language: Language) {
        return this.api.post('/indieopen/auth/resetPassword', { email, language }, undefined);
    }
}
