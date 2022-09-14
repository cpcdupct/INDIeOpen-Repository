import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, FormErrorHandlerService, ToastrWrapperService } from '@core/services';
import { InputData } from '@shared/models';
import { validateINDIeMediaURL } from 'app/units/models/validators';

import { UserInformation } from '../../models';
import { maxLengthName } from '../../models/validators';
import { UserService } from '../../services';

@Component({
    selector: 'io-tab-author-info',
    templateUrl: './tab-author-info.component.html',
    styleUrls: ['./tab-author-info.component.scss'],
})
export class TabAuthorInfoComponent implements OnInit {
    authorInfoForm!: FormGroup;
    isSubmitted = false;
    allowSubmit = true;

    component = 'user.author_info';

    nameInput: InputData = {
        component: this.component,
        name: 'name',
        type: 'text',
        label: true,
        required: true,
        autocomplete: 'given-name',
        control: new FormControl('', [Validators.required, maxLengthName]),
    };

    surnameInput: InputData = {
        component: this.component,
        name: 'surname',
        type: 'text',
        label: true,
        required: true,
        autocomplete: 'family-name',
        control: new FormControl('', [Validators.required, maxLengthName]),
    };

    countryInput: InputData = {
        component: this.component,
        name: 'country',
        type: 'text',
        label: true,
        required: true,
        autocomplete: 'country-name',
        control: new FormControl('', [Validators.required]),
    };

    institutionInput: InputData = {
        component: this.component,
        name: 'institution',
        type: 'text',
        label: true,
        required: true,
        autocomplete: 'organization',
        control: new FormControl('', [Validators.required]),
    };

    avatarInput: InputData = {
        component: this.component,
        name: 'avatar',
        type: 'url',
        label: true,
        required: true,
        autocomplete: 'photo',
        control: new FormControl('', [Validators.required, validateINDIeMediaURL]),
    };

    biographyInput: InputData = {
        component: this.component,
        name: 'biography',
        label: true,
        control: new FormControl(''),
    };

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private authService: AuthService,
        private toastrWrapper: ToastrWrapperService,
        private formErrorService: FormErrorHandlerService
    ) {}

    ngOnInit(): void {
        this.userService.getUserInfo().subscribe(info => {
            this.initForm(info);
        });
    }

    private initForm(info: UserInformation) {
        this.nameInput.control.setValue(info.name);
        this.surnameInput.control.setValue(info.surname);
        this.countryInput.control.setValue(info.country);
        this.institutionInput.control.setValue(info.institution);
        this.avatarInput.control.setValue(info.avatar);
        this.biographyInput.control.setValue(info.biography);

        this.authorInfoForm = this.formBuilder.group({
            name: this.nameInput.control,
            surname: this.surnameInput.control,
            country: this.countryInput.control,
            institution: this.institutionInput.control,
            avatar: this.avatarInput.control,
            biography: this.biographyInput.control,
        });
    }

    update() {
        this.isSubmitted = true;

        if (this.authorInfoForm.invalid) {
            this.toastrWrapper.error('messages.form_error.message', 'common.error');
            this.authorInfoForm.markAllAsTouched();
            window.scroll(0, 0);
        } else {
            this.allowSubmit = false;
            const infoBean: UserInformation = this.authorInfoForm.value as UserInformation;

            this.userService.updateUserInfo(infoBean).subscribe(
                res => {
                    this.allowSubmit = true;
                    this.toastrWrapper.success(
                        'user.author_info.messages.info_updated',
                        'common.success'
                    );

                    this.authService.updateUserInfo(infoBean.avatar, infoBean.name);
                },
                (error: HttpErrorResponse) => {
                    this.formErrorService.handleError(error);
                    this.allowSubmit = true;
                }
            );
        }
    }

    get formControls() {
        return this.authorInfoForm.controls;
    }
}
