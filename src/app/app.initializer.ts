import { ChangeThemeService } from '@core/services';
import { AuthService } from '@core/services/auth/auth.service';

/**
 * Function for refreshing the user token
 *
 * @param authService Auth service instance
 */
export function tokenRefresher(authService: AuthService) {
    if (authService.isLoggedIn())
        return () =>
            new Promise(resolve => {
                authService
                    .refreshToken()
                    .subscribe(response => {
                        authService.setCurrentUser({
                            access_token: response.access_token,
                            completeName: response.nombre + ' ' + response.apellido,
                            id: response.id,
                            refresh_token: response.refresh_token,
                            username: response.correo,
                            avatar: response.avatar,
                        });
                    })
                    .add(resolve);
            });

    return () => {};
}

/**
 * Function for chaning the theme as soon as the application loads in the client's browser.
 *
 * @param changeThemeService Change Theme service instance
 */
export function themeInitializer(changeThemeService: ChangeThemeService) {
    return () => changeThemeService.changeTheme();
}
