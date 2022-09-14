import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, createCookieUserFromUserInfo, UserInfo } from '@core/models';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

import { ApiService } from '../api/api.service';
import { CipherService } from '../cipher/cipher.service';
import { TenantService } from '../tenant/tenant.service';

/**
 * Service that provides functions to set/remove/update the current user information and use it within the application
 */
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    /** Key of the cookie and localstorage value item */
    private static readonly USER_KEY: string = 'MY_USER';

    /** Current user object. It can be defined (logged in) or undefined (not logged in) */
    currentUser?: UserInfo;

    constructor(
        private cookieService: CookieService,
        private cipherService: CipherService,
        private api: ApiService,
        private tenantService: TenantService
    ) {
        // Obtain the user information from localStorage
        const content = localStorage.getItem(AuthService.USER_KEY);

        // If the user information is already set
        if (content != null) {
            // Parse the user information
            const user: UserInfo = JSON.parse(content);

            // Set the current user
            this.currentUser = user;

            // Create a indie cookie from the user information
            const cookieUser = createCookieUserFromUserInfo(user);

            // Set the encrypted cookie
            this.cookieService.set(
                'MY_COOKIE',
                this.cipherService.encrypt(JSON.stringify(cookieUser)),
                7,
                '/',
                environment.cookie_domain
            );
        }
    }

    /**
     * Sets the current user information
     *
     * @param user UserInfo instance
     */
    setCurrentUser(user: UserInfo) {
        // Obtain the tenant name from the applied tenant
        user.tenant = this.tenantService.getCurrentTenant().id;

        // Stores the user in the localstorage
        const userString = JSON.stringify(user);
        localStorage.setItem(AuthService.USER_KEY, userString);

        // Create a indie cookie from the user information
        const cookieUser = createCookieUserFromUserInfo(user);

        // Set the encrypted cookie
        this.cookieService.set(
            'MY_COOKIE',
            this.cipherService.encrypt(JSON.stringify(cookieUser)),
            7,
            '/',
            environment.cookie_domain
        );

        // Set the current user
        this.currentUser = user;
    }

    /**
     * Get the current user information
     */
    getCurrentUser(): UserInfo {
        if (!this.currentUser) throw Error('NO ACTIVE SESSION');
        return this.currentUser;
    }

    /**
     * Return wether the user is logged in
     */
    isLoggedIn(): boolean {
        return this.currentUser !== undefined;
    }

    /**
     * Clear the user information from cookie and localstorage
     */
    clearUser() {
        localStorage.removeItem(AuthService.USER_KEY);
        this.cookieService.delete('MY_COOKIE');
        this.currentUser = undefined;
    }

    /**
     * Updates some of the current user (if set) information: Avatar and complete name.
     *
     * @param avatar User's new avatar
     * @param completeName User's new complete name
     */
    updateUserInfo(avatar: string, completeName: string) {
        if (this.currentUser) {
            this.currentUser.avatar = avatar;
            this.currentUser.completeName = completeName;
            localStorage.setItem(AuthService.USER_KEY, JSON.stringify(this.currentUser));
        }
    }

    /**
     * Refreshes the JWT access token with the refresh token stored in the current user information
     */
    refreshToken(): Observable<AuthResponse> {
        const data = `refresh_token=${this.currentUser?.refresh_token}&grant_type=refresh_token`;

        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        headers = headers.set(
            'Authorization',
            'Basic ' + btoa(`${environment.app_client}:${environment.app_password}`)
        );

        return this.api.postWithHeaders<AuthResponse>('/security/oauth/token', data, headers);
    }
}
