import { Injectable } from '@angular/core';
import { ApiService, AuthService } from '@core/services';
import { Observable } from 'rxjs';

/**
 * Service that handle user reset password
 */
@Injectable({
    providedIn: 'root',
})
export class ResetPasswordService {
    constructor(private api: ApiService, private authService: AuthService) {}

    /**
     * Send a reset password with a reset token password.
     *
     * @param password User's password
     * @param token Reset password token reset
     */
    resetPassword(password: string, token: string) {
        return this.api.put('/indieopen/auth/newPassword/' + token, { password }, undefined);
    }

    /**
     * Verify the token has the user's email
     *
     * @param token Reset password token
     */
    verifyToken(token: any): Observable<{ email: string }> {
        return this.api.get<{ email: string }>('/indieopen/auth/info/' + token, undefined);
    }
}
