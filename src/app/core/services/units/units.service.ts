import { Injectable } from '@angular/core';
import {
    CreativeCommons,
    OriginalUnitStatus,
    TokenResource,
    Unit,
    URLResource,
} from '@core/models';
import { createPageResponse, Page, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class UnitsService {
    constructor(private api: ApiService, private authService: AuthService) {}

    /**
     * Gets a page of Units with request params. The request params can also have saerch params.
     *
     * @param page Page number
     * @param requestParams Request params
     */
    findUnits(page: number, requestParams?: any): Observable<Page<Unit>> {
        let params: any = {
            page: page - 1,
            size: PAGE_DEFAULT_SIZE,
        };

        if (requestParams.sort) params.sort = requestParams.sort;

        if (requestParams) params = { ...params, ...requestParams };

        return this.api
            .get<Page<Unit>>(
                this.getUnitsURL(),
                this.authService.getCurrentUser().access_token,
                params
            )
            .pipe(map(res => createPageResponse(res)));
    }

    /**
     * Gets the full information about a Unit by id
     *
     * @param unitId Unit id
     */
    getUnitInfo(unitId: number): Observable<Unit> {
        return this.api.get<Unit>(
            this.getUnitsURL(unitId) + '/detail',
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Sends a preview request for unit by id
     *
     * @param unitId Unit id
     */
    previewUnit(unitId: number): Observable<URLResource> {
        return this.api.post<URLResource>(
            this.getUnitsURL(unitId) + '/preview',
            {},
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Generate an INDIe Editor token for a unit by id
     *
     * @param unitId Unit id
     */
    generateEditToken(unitId: number): Observable<TokenResource> {
        return this.api.get<TokenResource>(
            this.getUnitsURL(unitId) + '/edit',
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Publish a unit by id
     *
     * @param unitId Unit id
     */
    publishUnit(unitId: number): Observable<URLResource> {
        return this.api.post<URLResource>(
            this.getUnitsURL(unitId) + '/publish',
            {},
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Change the license of a unit by id with a Creative Commons license
     *
     * @param id Unit id
     * @param cc Creative Commons license to be applied
     */
    changeLicense(id: number, cc: CreativeCommons) {
        return this.api.put(
            this.getUnitsURL(id) + '/license',
            { license: cc },
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Delete a unit by id
     *
     * @param id Unit id
     */
    deleteUnit(id: number) {
        return this.api.delete(
            this.getUnitsURL(id),
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Add a shared unit into the user's unit. Language is needed in the evaluation unit case.
     *
     * @param id Unit id
     * @param language Language key
     */
    addSharedUnit(id: number, language: string): Observable<Unit> {
        return this.api.post<Unit>(
            '/indieopen/units/' + id + '/add?language=' + language,
            {},
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Obtain the original unit version status in case the unit is reused or copied.
     *
     * @param id Unit id
     */
    findOriginalUnitStatusVersion(id: number): Observable<OriginalUnitStatus> {
        return this.api.get<OriginalUnitStatus>(
            `/indieopen/units/${id}/original`,
            this.authService.getCurrentUser().access_token
        );
    }

    updateNonOriginalUnitVersion(id: number) {
        return this.api.put(
            `/indieopen/units/${id}/update`,
            {},
            this.authService.getCurrentUser().access_token
        );
    }

    toggleLearningAnalytics(id: number, analytics: boolean) {
        return this.api.put(
            `/indieopen/units/${id}/analytics?analytics=${analytics}`,
            {},
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Creates a URL for accessing the endpoint API of units
     *
     * @param unitId Unit id
     */
    private getUnitsURL(unitId?: number): string {
        if (unitId) return '/indieopen/units/' + unitId;

        return '/indieopen/units';
    }
}
