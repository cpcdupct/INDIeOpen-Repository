import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Tenant } from './tenant';
import productionTenants from './tenants.json';
import devTenants from './tenants-dev.json';
import { OriginService } from '../origin/origin.service';

/**
 * Service that provides the Tenant applied in the application
 */
@Injectable({
    providedIn: 'root',
})
export class TenantService {
    /** Available tenants */
    private tenants: Tenant[];

    /** Default tenant. Default to indieopen */
    private defaultTenant: Tenant;

    /** Current tenant */
    private currentTenant: Tenant | undefined;

    constructor(private originService: OriginService) {
        // Environment-aware tenant setup
        this.tenants = environment.production ? productionTenants : devTenants;

        // Setup tenants
        this.defaultTenant = this.getDefaultTenant();
        this.currentTenant = this.tenants.find(
            t => t.origin === this.originService.getCurrentHostName()
        );
    }

    /**
     * Get the default tenant
     */
    private getDefaultTenant(): Tenant {
        const defaultTenant = this.tenants.find(t => t.id === 'indieopen');
        if (defaultTenant) return defaultTenant;
        throw new Error('No default tenant.');
    }

    /**
     * Get the current applied tenant
     */
    getCurrentTenant() {
        return this.currentTenant ? this.currentTenant : this.defaultTenant;
    }

    /**
     * Find the tenant that applies to the specified domain if exists
     *
     * @param domain Specified domain
     */
    findTenantByAllowedDomain(domain: string | undefined): Tenant | undefined {
        if (!domain) return undefined;

        return this.tenants.find(
            t => t.allowedEmailDomain && domain.endsWith(t.allowedEmailDomain)
        );
    }
}
