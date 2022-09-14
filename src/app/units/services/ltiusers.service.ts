import { Injectable } from '@angular/core';
import { ApiService, AuthService } from '@core/services';
import { Observable } from 'rxjs';
import { LTIUser } from '../models';

@Injectable({
    providedIn: 'root',
})
export class LTIUsersService {
    constructor(private api: ApiService, private authService: AuthService) {}

    findUnitAccesesForUnit(id: number): Observable<LTIUser[]> {
        return this.api.get<LTIUser[]>(
            '/indieopen/units/' + id + '/access',
            this.authService.getCurrentUser().access_token
        );
    }

    findAccessesByCourse(id: number): Observable<LTIUser[]> {
        return this.api.get<LTIUser[]>(
            '/indieopen/courses/' + id + '/access',
            this.authService.getCurrentUser().access_token
        );
    }

    findAvailableUsers(): Observable<LTIUser[]> {
        return this.api.get<LTIUser[]>(
            '/indieopen/user/available',
            this.authService.getCurrentUser().access_token
        );
    }

    updateUintAccess(unitid: number, selectedUsers: string[]) {
        return this.api.put(
            '/indieopen/units/' + unitid + '/access',
            selectedUsers,
            this.authService.getCurrentUser().access_token
        );
    }

    updateCourseAccess(unitid: number, selectedUsers: string[]) {
        return this.api.put(
            '/indieopen/courses/' + unitid + '/access',
            selectedUsers,
            this.authService.getCurrentUser().access_token
        );
    }
}
