import { Injectable } from '@angular/core';

/**
 * Service that provide the current host name extracted from the location.origin object via Javascript browser API
 */
@Injectable({
    providedIn: 'root',
})
export class OriginService {
    /** Origin URL */
    private origin: URL;

    constructor() {
        this.origin = new URL(location.origin);
    }

    /**
     * Gets the current hsot name from the origin
     */
    getCurrentHostName(): string {
        return this.origin.hostname;
    }
}
