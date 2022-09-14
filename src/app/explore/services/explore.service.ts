import { Injectable } from '@angular/core';
import { Unit, UnitType } from '@core/models';
import { ApiService } from '@core/services';
import { Observable } from 'rxjs';

import { RecentAddedUnit, TopRatedUnit } from '../models';

/**
 * Service that handles the retrival of units for the explore page.
 */
@Injectable({
    providedIn: 'root',
})
export class ExploreService {
    constructor(private api: ApiService) {}

    /**
     * Get the public information about a unit
     *
     * @param unitId Unit id
     */
    getUnitInfo(unitId: number): Observable<Unit> {
        return this.api.get<Unit>('/indieopen/explore/details/' + unitId, undefined);
    }

    /**
     * Get a list of recent added units. If a type is specified, recent units based on the type will be retrieved
     *
     * @param type Unit type if present
     */
    getRecentAddedUnits(type?: UnitType): Observable<RecentAddedUnit[]> {
        const params: any = {};
        if (type) params.type = type;

        return this.api.get<RecentAddedUnit[]>('/indieopen/explore/recent', undefined, params);
    }

    /**
     * Get a list of top rated units.
     */
    getTopRatedUnits(): Observable<TopRatedUnit[]> {
        return this.api.get<TopRatedUnit[]>('/indieopen/explore/top', undefined);
    }
}
