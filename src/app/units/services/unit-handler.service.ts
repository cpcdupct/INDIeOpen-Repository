import { Injectable } from '@angular/core';
import { Unit } from '@core/models';
import { ApiService, AuthService } from '@core/services';
import { Observable } from 'rxjs';

import { CreateUnitModel, UpdateUnitInfoModel } from '../models';

@Injectable({
    providedIn: 'root',
})
export class UnitHandlerService {
    constructor(private api: ApiService, private authService: AuthService) {}

    createUnit(createUnitBean: CreateUnitModel): Observable<Unit> {
        return this.api.post<Unit>(this.getUnitsURL(), createUnitBean, this.auth());
    }

    updateUnitInfo(unitId: number, updateUnitInfo: UpdateUnitInfoModel): Observable<Unit> {
        return this.api.put(this.getUnitsURL(unitId) + '/info', updateUnitInfo, this.auth());
    }

    private getUnitsURL(unitId?: number): string {
        if (unitId) return '/indieopen/units/' + unitId;

        return '/indieopen/units';
    }

    private auth() {
        return this.authService.getCurrentUser().access_token;
    }
}
