import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { INDIeError } from '@core/models';
import { AuthService, FormErrorHandlerService, ToastrWrapperService } from '@core/services';
import { InputData } from '@shared/models';
import { MustMatch, safePassword } from 'app/units/models/validators';

import { UserService } from '../../services';

@Component({
    selector: 'io-tab-user-info',
    templateUrl: './tab-user-info.component.html',
    styleUrls: ['./tab-user-info.component.scss'],
})
export class TabUserInfoComponent implements OnInit {
    userInfoForm!: FormGroup;
    isSubmitted = false;
    allowSubmit = true;

    component = 'user.user_account';

    emailInput: InputData = {
        component: this.component,
        name: 'email',
        type: 'email',
        label: true,
        control: new FormControl(''),
    };

    newPasswordInput: InputData = {
        component: this.component,
        name: 'newPassword',
        type: 'password',
        label: true,
        required: true,
        autocomplete: 'new-password',
        control: new FormControl('', [Validators.required, safePassword]),
    };

    repeatPasswordInput: InputData = {
        component: this.component,
        name: 'repeatPassword',
        type: 'password',
        label: true,
        required: true,
        autocomplete: 'new-password',
        control: new FormControl('', [Validators.required, safePassword]),
    };

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private toastrWrapper: ToastrWrapperService,
        private authService: AuthService,
        private formErrorService: FormErrorHandlerService
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    private initForm() {
        this.emailInput.control.setValue(this.authService.getCurrentUser().username);
        this.emailInput.control.disable();

        this.userInfoForm = this.formBuilder.group(
            {
                email: this.emailInput.control,
                newPassword: this.newPasswordInput.control,
                repeatPassword: this.repeatPasswordInput.control,
            },
            {
                validator: MustMatch('newPassword', 'repeatPassword'),
            }
        );
    }

    submit() {
        this.isSubmitted = true;

        if (this.userInfoForm.invalid) {
            this.toastrWrapper.error('messages.form_error.message', 'common.error');

            this.userInfoForm.markAllAsTouched();
            window.scroll(0, 0);
        } else {
            this.allowSubmit = false;

            const data: any = {
                newPassword: this.newPasswordInput.control.value,
            };

            this.userService.updatePassword(data).subscribe(
                res => {
                    this.allowSubmit = true;
                    this.toastrWrapper.success(
                        'user.user_account.messages.password_changed',
                        'common.success'
                    );

                    this.userInfoForm.markAsUntouched();
                    this.userInfoForm.reset();
                    this.emailInput.control.setValue(this.authService.getCurrentUser().username);
                },
                (err: HttpErrorResponse) => {
                    const error = err.error as INDIeError;

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
