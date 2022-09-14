import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionResultEventType, Language, Unit, UnitType } from '@core/models';
import {
    CategoryService,
    ChangeThemeService,
    FormErrorHandlerService,
    ToastrWrapperService,
} from '@core/services';
import { RouterExtService } from '@core/services/router-ext/router-ext.service';
import {
    InputData,
    OptionWrapper,
    OptionItem,
    RANGE_MAX_DEFAULT,
    RANGE_MIN_DEFAULT,
} from '@shared/models';
import { UnitHandlerService } from 'app/units/services/unit-handler.service';

import { CreateUnitModel } from '../../models';
import { validateCoverURL, validateINDIeMediaURL } from '../../models/validators';

@Component({
    selector: 'io-create-unit',
    templateUrl: './create-unit.component.html',
    styleUrls: ['./create-unit.component.scss'],
})
export class CreateUnitComponent implements OnInit {
    /** Form data */
    createUnit!: FormGroup;
    isSubmitted = false;
    allowSubmit = true;

    component = 'units';

    /** Inputs  */
    unitNameInput: InputData = {
        component: this.component,
        name: 'name',
        type: 'text',
        label: true,
        required: true,
        minLength: 1,
        maxLength: 120,
        control: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(120),
        ]),
    };

    selectTypeInput: InputData = {
        component: this.component,
        name: 'type',
        label: true,
        required: true,
        control: new FormControl(UnitType.CONENT, [Validators.required]),
    };

    selectLanguageInput: InputData = {
        component: this.component,
        name: 'language',
        label: true,
        required: true,
        control: new FormControl(Language.EN, [Validators.required]),
    };

    selectCategoryInput: InputData = {
        component: this.component,
        name: 'category',
        label: true,
        required: true,
        control: new FormControl('', [Validators.required]),
    };

    shortDescriptionInput: InputData = {
        component: this.component,
        name: 'shortDescription',
        label: true,
        required: true,
        minLength: 1,
        maxLength: 240,
        control: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(240),
        ]),
    };

    coverInput: InputData = {
        component: this.component,
        name: 'cover',
        type: 'url',
        label: true,
        required: true,
        control: new FormControl('', [
            Validators.required,
            validateINDIeMediaURL,
            validateCoverURL,
        ]),
    };

    longDescriptionInput: InputData = {
        component: this.component,
        name: 'longDescription',
        label: true,
        maxLength: 2000,
        control: new FormControl('', [Validators.minLength(0), Validators.maxLength(2000)]),
    };

    tagsInput: InputData = {
        component: this.component,
        name: 'tags',
        label: true,
        control: new FormControl(''),
    };

    ageRangeInput: InputData = {
        component: this.component,
        name: 'ageRange',
        required: true,
        label: true,
        control: new FormControl([RANGE_MIN_DEFAULT, RANGE_MAX_DEFAULT], [Validators.required]),
    };

    educationalContextInput: InputData = {
        component: this.component,
        name: 'educationalContext',
        label: true,
        required: true,
        control: new FormControl([], [Validators.required]),
    };

    selectThemeInput: InputData = {
        component: this.component,
        name: 'theme',
        label: true,
        required: true,
        control: new FormControl('GeneralTheme1', [Validators.required]),
    };

    /** Options */
    typeOptionWrapper!: OptionWrapper;
    languageOptionWrapper!: OptionWrapper;
    themeOptionWrapper!: OptionWrapper;

    private lastUrl!: string;

    constructor(
        private formBuilder: FormBuilder,
        private unitHandler: UnitHandlerService,
        private router: Router,
        private urlService: RouterExtService,
        private toastrWrapper: ToastrWrapperService,
        private formErrorService: FormErrorHandlerService,
        private categoryService: CategoryService,
        private themeService: ChangeThemeService
    ) {}

    ngOnInit(): void {
        this.initTypes();
        this.initForm();
        this.urlService.previousUrl$.subscribe((previousUrl: string) => {
            this.lastUrl = previousUrl;
        });
    }

    private initTypes() {
        this.typeOptionWrapper = {
            selected: UnitType.CONENT,
            options: [
                {
                    label: 'types.content',
                    value: UnitType.CONENT,
                },
                {
                    label: 'types.evaluation',
                    value: UnitType.EVALUATION,
                },
            ],
        };

        this.languageOptionWrapper = {
            selected: Language.EN,
            options: Object.values(Language).map(lang => {
                return {
                    label: 'languages.' + lang,
                    value: lang,
                };
            }),
        };

        const options: OptionItem[] = [];

        for (const resource of this.themeService.getThemeOrDefault().unitThemes) {
            options.push({
                label: resource,
                value: resource,
            });
        }

        this.themeOptionWrapper = {
            selected: 'GeneralTheme1',
            options,
        };
    }

    private initForm() {
        this.selectCategoryInput.control.setValue(this.categoryService.categories[0].key);

        this.createUnit = this.formBuilder.group({
            name: this.unitNameInput.control,
            type: this.selectTypeInput.control,
            language: this.selectLanguageInput.control,
            category: this.selectCategoryInput.control,
            shortDescription: this.shortDescriptionInput.control,
            cover: this.coverInput.control,
            longDescription: this.longDescriptionInput.control,
            tags: this.tagsInput.control,
            ageRange: this.ageRangeInput.control,
            educationalContext: this.educationalContextInput.control,
            theme: this.selectThemeInput.control,
        });
    }

    create() {
        this.isSubmitted = true;
        if (this.createUnit.invalid) {
            this.toastrWrapper.error('messages.form_error.message', 'common.error');
            this.createUnit.markAllAsTouched();
            window.scroll(0, 0);
        } else {
            this.allowSubmit = false;
            const createUnitBean: CreateUnitModel = this.createModel(this.createUnit.value);

            this.unitHandler.createUnit(createUnitBean).subscribe(
                (res: Unit) => {
                    this.router.navigateByUrl(this.lastUrl !== '/' ? this.lastUrl : '/units', {
                        state: {
                            type: ActionResultEventType.SUCCESS,
                            key: 'units.create_unit.messages.created_unit.ok.message',
                        },
                    });
                },
                (errorResponse: HttpErrorResponse) => {
                    this.formErrorService.handleError(errorResponse);
                    this.allowSubmit = true;
                }
            );
        }
    }

    private createModel(value: any): CreateUnitModel {
        const createUnitBean: CreateUnitModel = value as CreateUnitModel;
        if (createUnitBean.tags.length > 0) {
            const tagsArray: string[] = [];

            createUnitBean.tags.forEach(element => {
                tagsArray.push(element.display);
            });

            createUnitBean.tags = tagsArray;
        } else createUnitBean.tags = [];

        if (createUnitBean.educationalContext.length > 0) {
            const edContextArray: number[] = [];

            createUnitBean.educationalContext.forEach(element => {
                edContextArray.push(element.value);
            });

            createUnitBean.educationalContext = edContextArray;
        }

        return createUnitBean;
    }

    get formControls() {
        return this.createUnit.controls;
    }

    showThemeInfo() {
        window.open(this.themeService.getThemeOrDefault().unitThemesUrl, '_blank');
    }
}
