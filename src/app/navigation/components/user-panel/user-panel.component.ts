import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserInfo } from '@core/models';
import { AuthService, TenantService } from '@core/services';

/**
 * User panel component
 */
@Component({
    selector: 'io-user-panel',
    templateUrl: './user-panel.component.html',
    styleUrls: ['./user-panel.component.scss', '../../containers/top-nav/top-nav.component.scss'],
})
export class UserPanelComponent implements OnInit {
    /** User info */
    user!: UserInfo;

    /** User status change output event */
    @Output()
    userStatusChanged = new EventEmitter<boolean>();

    constructor(private authService: AuthService, private tenantService: TenantService) {}

    ngOnInit(): void {
        this.user = this.authService.getCurrentUser();
    }

    /**
     * Send a logout request or go to the logout endpoint
     */
    logout() {
        const currentTenant = this.tenantService.getCurrentTenant();

        if (currentTenant.logoutEndpoint) {
            window.location.href = currentTenant.logoutEndpoint;
        } else {
            this.authService.clearUser();
            this.userStatusChanged.emit(false);
        }
    }

    /**
     * Return wether the application must show user settings
     */
    showUserSettings(): boolean {
        return this.tenantService.getCurrentTenant().id === 'indieopen';
    }
}
