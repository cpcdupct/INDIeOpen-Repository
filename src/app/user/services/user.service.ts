import { Injectable } from '@angular/core';
import { ApiService, AuthService } from '@core/services';
import { Observable } from 'rxjs';

import { UserInformation } from '../models';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private API_ROOT = '/indieopen/user';

    constructor(private api: ApiService, private authService: AuthService) {}

    getUserInfo(): Observable<UserInformation> {
        return this.api.get<UserInformation>(this.API_ROOT + '/info', this.auth());
    }

    updateUserInfo(info: UserInformation) {
        return this.api.put(this.API_ROOT + '/info', info, this.auth());
    }

    updatePassword(data: any) {
        return this.api.put(this.API_ROOT + '/password', data, this.auth());
    }

    private auth() {
        return this.authService.getCurrentUser().access_token;
    }
}
