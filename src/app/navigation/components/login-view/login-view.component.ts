import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { INDIeError, Language } from '@core/models';
import { ChangeThemeService, TenantService } from '@core/services';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService } from '@shared/components/alerts/alerts.service';
import { InputData } from '@shared/models';
import HttpStatusCode from '@shared/models/statusCodes.model';

import { LoginBean } from '../../models';
import { UserControlService } from '../../services';

/**
 * Login form modal view component
 */
@Component({
    selector: 'io-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.scss'],
})
export class LoginViewComponent implements OnInit {
    /** Modal option for the login modal */
    static options: NgbModalOptions = {
        windowClass: 'modal-holder view-unit',
        keyboard: true,
        ariaLabelledBy: 'login-title',
    };

    /** Form view shown in the modal (EMAIL, RESET, LOGIN)  */
    view = 'EMAIL';
    /** Login form */
    loginForm!: FormGroup;
    /** Reset form */
    resetPasswordForm!: FormGroup;
    /** Email form */
    emailForm!: FormGroup;
    /** Form is submitted */
    isSubmitted = false;
    /** Allow form to be submitted */
    allowSubmit = true;

    /** Inputs for email  */
    emailInput: InputData = {
        name: 'username',
        component: 'io-login-view',
        type: 'email',
        required: true,
        control: new FormControl('', [Validators.required, Validators.email]),
        autocomplete: 'username',
    };

    /** Form inputs data for login */
    usernameInput: InputData = {
        name: 'username',
        component: 'io-login-view',
        type: 'email',
        required: true,
        control: new FormControl('', [Validators.required, Validators.email]),
        autocomplete: 'username',
    };

    /** Input for password */
    passwordInput: InputData = {
        name: 'password',
        component: 'io-login-view',
        type: 'password',
        required: true,
        minLength: 6,
        autocomplete: 'current-password',
        control: new FormControl('', [Validators.required, Validators.minLength(6)]),
    };

    /** Form inputs data for reset password */
    mailInput: InputData = {
        name: 'mail',
        component: 'io-login-view',
        type: 'email',
        required: true,
        control: new FormControl('', [Validators.required, Validators.email]),
        autocomplete: 'username',
    };

    constructor(
        private activeModal: NgbActiveModal,
        private userControlService: UserControlService,
        private formBuilder: FormBuilder,
        private alertService: AlertsService,
        private translateSerivce: TranslateService,
        private themeService: ChangeThemeService,
        private tenantService: TenantService
    ) {}

    ngOnInit(): void {
        this.initEmailForm();
    }

    /**
     * Init email form
     */
    private initEmailForm() {
        this.emailForm = this.formBuilder.group({
            username: this.emailInput.control,
        });
    }

    /**
     * Init login form with username fixed
     *
     * @param username Username
     */
    private initLoginForm(username: string) {
        this.usernameInput.control.setValue(username);
        this.usernameInput.control.disable();

        this.loginForm = this.formBuilder.group({
            username: this.usernameInput.control,
            password: this.passwordInput.control,
        });
    }

    /**
     * Init reset password form
     */
    private initResetPasswordForm() {
        this.resetPasswordForm = this.formBuilder.group({
            mail: this.mailInput.control,
        });
    }

    /**
     * Send login request based on the applied tenant. If the applied is outside the indie ecosystem,
     * a login endpoint should be called. Otherwise, the INDIe Ecosystem will take caer of the authentication
     * process
     */
    requestLogin() {
        this.isSubmitted = true;

        if (this.emailForm.invalid) {
            this.emailForm.markAllAsTouched();
        } else {
            this.allowSubmit = false;

            const email: string = this.emailInput.control.value;
            const domain = email.split('@')[1];
            const currentTenant = this.tenantService.getCurrentTenant();

            // 1 Check if the current tenant allows the domain
            if (
                currentTenant.allowedEmailDomain &&
                domain.endsWith(currentTenant.allowedEmailDomain)
            ) {
                window.location.href = currentTenant.loginEndpoint;
            }
            // 2 If in the current tennat there is no allowed domain,
            else if (!currentTenant.allowedEmailDomain) {
                // 2.1 Check wether the provided email is in another tenant, in that case access is forbidden
                if (this.tenantService.findTenantByAllowedDomain(domain) !== undefined) {
                    this.alertService.error('io-login-view.messages.domain_not_allowed');
                    this.allowSubmit = true;
                }
                // 2.2 If there is no tenant associated with the domain, then proceed
                else {
                    this.showLogin(email);
                }
            } else {
                this.alertService.error('io-login-view.messages.domain_not_allowed');
                this.allowSubmit = true;
            }
        }
    }

    /**
     * Submit the form login for INDIe login authentication process
     */
    signIn() {
        this.isSubmitted = true;

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
        } else {
            this.allowSubmit = false;
            const loginRequestInfo = this.loginForm.getRawValue() as LoginBean;
            this.userControlService.doLogin(loginRequestInfo).subscribe(
                result => {
                    this.userControlService.loginSuccessful(result);
                    this.activeModal.close({ logged: true });
                },
                (errorResponse: HttpErrorResponse) => {
                    if (errorResponse.status === 400) {
                        this.alertService.error('io-login-view.invalid_credentials');
                        this.loginForm.reset();
                        this.usernameInput.control.setValue(loginRequestInfo.username);
                    }

                    this.allowSubmit = true;
                }
            );
        }
    }

    /**
     * Send a reset password request
     */
    resetPassword() {
        this.isSubmitted = true;

        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
        } else {
            this.allowSubmit = false;

            const email: string = this.resetPasswordForm.get('mail')?.value;
            const language: Language = this.translateSerivce
                .getBrowserLang()
                .toUpperCase() as Language;

            this.userControlService.requestResetPassword(email, language).subscribe(
                res => {
                    this.activeModal.close({ reset: true });
                },
                (error: HttpErrorResponse) => {
                    const indieError = error.error as INDIeError;

                    if (indieError.status === HttpStatusCode.BAD_REQUEST) {
                        this.alertService.error('io-login-view.messages.email_error');
                    }

                    this.allowSubmit = true;
                }
            );
        }
    }

    /** Show the reset password form */
    showReset() {
        this.allowSubmit = true;
        this.isSubmitted = false;
        this.view = 'RESET';
        this.initResetPasswordForm();
    }

    /**
     * Show the indie login form with the username fixed
     *
     * @param email username email
     */
    showLogin(email: string) {
        this.allowSubmit = true;
        this.isSubmitted = false;
        this.view = 'LOGIN';
        this.initLoginForm(email);
    }

    /**
     * Show email
     */
    showEmail() {
        this.allowSubmit = true;
        this.isSubmitted = false;
        this.view = 'EMAIL';
        this.initEmailForm();
    }

    /**
     * Return wether the forgot password option must be shown
     */
    showForgotPassword() {
        return this.view === 'EMAIL' && this.tenantService.getCurrentTenant().id !== 'upctofmra';
    }

    /**
     * Get the login logo source based on the theme applied
     */
    getLoginLogoSrc() {
        const theme = this.themeService.getThemeOrDefault();
        if (theme) return theme.resources.loginLogo;
    }

    /**
     * Closes the modal
     */
    closeModal() {
        this.activeModal.close();
    }
}
