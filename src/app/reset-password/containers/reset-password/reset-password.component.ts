import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { INDIeError } from '@core/models';
import { FormErrorHandlerService, ToastrWrapperService } from '@core/services';
import { InputData } from '@shared/models';
import { MustMatch, safePassword } from 'app/units/models/validators';

import { ResetPasswordService } from '../../services';

/**
 * Reset password component
 */
@Component({
    selector: 'io-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    /** Token to reset the password */
    token!: string;
    /** Reset Password form  */
    resetPasswordForm!: FormGroup;
    /** Show form */
    showForm = false;
    /** Form submitted */
    isSubmitted = false;
    /** Allow submit form */
    allowSubmit = true;

    /** Email input */
    emailInput: InputData = {
        component: 'reset-password',
        name: 'email',
        type: 'email',
        label: true,
        required: true,
        control: new FormControl(''),
    };

    /** New password input */
    newPasswordInput: InputData = {
        component: 'reset-password',
        name: 'newPassword',
        type: 'password',
        label: true,
        required: true,
        control: new FormControl('', [Validators.required, safePassword]),
    };

    /** Repeat password input */
    repeatPasswordInput: InputData = {
        component: 'reset-password',
        name: 'repeatPassword',
        type: 'password',
        label: true,
        required: true,
        control: new FormControl('', [Validators.required, safePassword]),
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastrWrapper: ToastrWrapperService,
        private resetPasswordService: ResetPasswordService,
        private formErrorService: FormErrorHandlerService
    ) {}

    ngOnInit(): void {
        //
        this.route.queryParams.subscribe(params => {
            if (!params.t) {
                this.router.navigateByUrl('/explore');
            } else {
                this.token = params.t;
                this.resetPasswordService.verifyToken(this.token).subscribe(
                    res => {
                        this.loadForm(res.email);
                        this.showForm = true;
                    },
                    err => {
                        this.toastrWrapper.error(
                            'reset-password.messages.token_not_Valid',
                            'common.error'
                        );
                        this.router.navigateByUrl('/explore');
                    }
                );
            }
        });
    }

    /**
     * Load the email form
     *
     * @param email
     */
    private loadForm(email: string) {
        this.resetPasswordForm = this.formBuilder.group(
            {
                email: this.emailInput.control,
                newPassword: this.newPasswordInput.control,
                repeatPassword: this.repeatPasswordInput.control,
            },
            {
                validator: MustMatch('newPassword', 'repeatPassword'),
            }
        );

        this.emailInput.control.setValue(email);
        this.emailInput.control.disable();
    }

    /**
     *
     */
    resetPassword() {
        this.isSubmitted = true;

        if (this.resetPasswordForm.invalid) {
            this.toastrWrapper.error('messages.form_error.message', 'common.error');
            this.resetPasswordForm.markAllAsTouched();
            window.scroll(0, 0);
        } else {
            this.allowSubmit = false;
            const password: string = this.newPasswordInput.control.value;

            this.resetPasswordService.resetPassword(password, this.token).subscribe(
                res => {
                    this.allowSubmit = true;
                    this.toastrWrapper.success(
                        'user.user_account.messages.password_changed',
                        'common.success'
                    );

                    this.router.navigateByUrl('/explore');
                },
                (err: HttpErrorResponse) => {
                    const error = err.error as INDIeError;

                    if (error.errorCode === 'WRONG_PASSWORD')
                        this.toastrWrapper.error(
                            'user.user_account.messages.wrong_password',
                            'common.error'
                        );

                    if (error.errorCode === 'UNSAFE_PASSWORD')
                        this.toastrWrapper.error(
                            'user.user_account.messages.unsafe_password',
                            'common.error'
                        );

                    this.formErrorService.handleError(err);
                    this.allowSubmit = true;
                }
            );
        }
    }
}
