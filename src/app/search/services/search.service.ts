import { Injectable } from '@angular/core';
import { AuthorResource, Unit } from '@core/models';
import { ApiService } from '@core/services';
import { createPageResponse, Page, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service that handles the search of units in the web api based on the parameters set by the user
 */
@Injectable({
    providedIn: 'root',
})
export class SearchService {
    constructor(private api: ApiService) {}

    /**
     * Search units using search parameters set by the filters in the search page
     *
     * @param page Page number
     * @param requestParams Search request parameters
     */
    searchUnits(page: number, requestParams: any): Observable<Page<Unit>> {
        let params: any = {
            page: page - 1,
            size: PAGE_DEFAULT_SIZE,
        };

        if (requestParams.sort) params.sort = requestParams.sort;

        if (requestParams) params = { ...params, ...requestParams };

        return this.api
            .get<Page<Unit>>('/indieopen/explore/search', undefined, params)
            .pipe(map(res => createPageResponse(res)));
    }

    /**
     * Get the unit's public info by id
     *
     * @param unitId Unit id
     */
    getUnitInfo(unitId: number): Observable<Unit> {
        return this.api.get<Unit>('/indieopen/explore/details/' + unitId, undefined);
    }

    /**
     * Find a set of Authors by name that has published at least one unit
     *
     * @param name Authors name (or subname)
     */
    findAuthorsByName(name: string): Observable<AuthorResource[]> {
        return this.api.get<AuthorResource[]>('/indieopen/explore/authors', undefined, { name });
    }

    /**
     * Find public information about an author by id
     *
     * @param id Author id
     */
    findAuthor(id: string): Observable<AuthorResource> {
        return this.api.get<AuthorResource>(`/indieopen/explore/authors/${id}`, undefined);
    }
}
