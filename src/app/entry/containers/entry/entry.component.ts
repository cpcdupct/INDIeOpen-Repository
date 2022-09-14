import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, ToastrWrapperService } from '@core/services';
import { EntryService } from 'app/entry/services';

/**
 * Entry page component
 */
@Component({
    selector: 'io-entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
    /** Request loader */
    loader = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private entryService: EntryService,
        private authService: AuthService,
        private toast: ToastrWrapperService
    ) {}

    /**
     * @inheritdoc
     *
     * Retrieves the ticket for the token and, if it is exist, a user token is retrieved
     */
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const sid = params.sid;
            const logout = params.logout;

            if (sid) {
                this.entryService.retrieveToken(sid).subscribe(
                    response => {
                        this.authService.setCurrentUser({
                            access_token: response.access_token,
                            completeName: response.nombre + ' ' + response.apellido,
                            id: response.id,
                            refresh_token: response.refresh_token,
                            username: response.correo,
                            avatar: response.avatar,
                        });

                        this.toast.success(
                            'io-login-view.messages.login_now',
                            'io-login-view.messages.login_welcome'
                        );

                        this.router.navigate(['/explore']);
                    },
                    err => {
                        this.toast.warning('io-login-view.invalid_credentials', 'common.error');
                        this.router.navigate(['/explore']);
                    }
                );
            } else if (logout) {
                this.authService.clearUser();
                this.toast.success(
                    'io-login-view.messages.logout',
                    'io-login-view.messages.goodbye'
                );

                this.router.navigate(['explore']);
            } else {
                this.router.navigateByUrl('/explore');
                this.toast.warning('io-login-view.invalid_credentials', 'common.error');
            }
        });
    }
}
