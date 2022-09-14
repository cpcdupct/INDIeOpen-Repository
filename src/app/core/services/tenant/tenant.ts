/** Tenant interface */
export interface Tenant {
    /** Origin URL where the tenant should be applied */
    origin: string;
    /** Tenant ID */
    id: string;
    /** Login request endpoint */
    loginEndpoint: string;
    /** JWT Token retrival endpoint */
    tokenEndpoint: string;
    /** Logout request enpoint */
    logoutEndpoint?: string;
    /** Allowed global domain for logging in */
    allowedEmailDomain?: string;
}
