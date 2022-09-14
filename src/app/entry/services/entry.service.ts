import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '@core/models';
import { ApiService, TenantService } from '@core/services';

/**
 * Service that handles an authentication with a login provider
 */
@Injectable({
    providedIn: 'root',
})
export class EntryService {
    constructor(private api: ApiService, private tenantService: TenantService) {}

    /**
     * Uses a ticket to retreive a user token from the API
     *
     * @param sid Ticket for the token retrival
     */
    retrieveToken(sid: string) {
        return this.api.getWithHeadersAndFullURL<AuthResponse>(
            this.tenantService.getCurrentTenant().tokenEndpoint + '/' + sid,
            new HttpHeaders()
        );
    }
}
