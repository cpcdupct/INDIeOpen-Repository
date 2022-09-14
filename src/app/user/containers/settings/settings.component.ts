import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TenantService } from '@core/services';

@Component({
    selector: 'io-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    active = 'top';

    constructor(private tenantService: TenantService, private router: Router) {}

    ngOnInit(): void {
        if (this.tenantService.getCurrentTenant().id !== 'indieopen') {
            this.router.navigate(['/explore'], {
                queryParams: {
                    forbidden: 'true',
                },
            });
        }
    }
}
