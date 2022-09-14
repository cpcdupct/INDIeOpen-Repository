import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    ActionResultEvent,
    ActionResultEventType,
    canEditUnit,
    findEducationalContextByKeyAndLanguage,
    Language,
    Unit,
    UnitType,
} from '@core/models';
import { ChangeThemeService, FormErrorHandlerService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import {
    InputData,
    OptionItem,
    OptionWrapper,
    RANGE_MAX_DEFAULT,
    RANGE_MIN_DEFAULT,
} from '@shared/models';
import { UnitHandlerService } from 'app/units/services/unit-handler.service';

import { UpdateUnitInfoModel } from '../../models';
import { validateCoverURL, validateINDIeMediaURL } from '../../models/validators';

@Component({
    selector: 'io-tab-unit-info',
    templateUrl: './tab-unit-info.component.html',
    styleUrls: ['./tab-unit-info.component.scss'],
})
export class TabUnitInfoComponent implements OnInit {
    @Input()
    unit!: Unit;

    @Output()
    actionResult = new EventEmitter<ActionResultEvent>();

    /** Form data */
    updateUnitInfoForm!: FormGroup;
    isSubmitted = false;
    allowSubmit = true;
    component = 'units';

    /** Inputs  */
    /** Inputs  */
    unitNameInput: InputData = {
        component: this.component,
        name: 'name',
        type: 'text',
        label: true,
        required: true,
        control: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(120),
        ]),
    };

    selectLanguageInput: InputData = {
        component: this.component,
        name: 'language',
        label: true,
        required: true,
        control: new FormControl(Language.EN, [Validators.required]),
    };

    selectTypeInput: InputData = {
        component: this.component,
        name: 'type',
        label: true,
        required: true,

        control: new FormControl('', [Validators.required]),
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
            validateCoverURL,
            validateINDIeMediaURL,
        ]),
    };

    longDescriptionInput: InputData = {
        component: this.component,
        name: 'longDescription',
        label: true,
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
        required: true,
        label: true,
        control: new FormControl([], [Validators.required]),
    };

    selectThemeInput: InputData = {
        component: this.component,
        name: 'theme',
        label: true,
        required: true,
        control: new FormControl('GeneralTheme1', [Validators.required]),
    };

    /* OPTIONS */
    languageOptionWrapper!: OptionWrapper;
    typeOptionWrapper!: OptionWrapper;
    themeOptionWrapper!: OptionWrapper;

    constructor(
        private formBuilder: FormBuilder,
        private unitHandler: UnitHandlerService,
        private formErrorService: FormErrorHandlerService,
        private translate: TranslateService,
        private themeService: ChangeThemeService
    ) {}

    ngOnInit(): void {
        this.initTypes();
        this.setFormData(this.unit);
        this.loadForm();
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

    private setFormData(unit: Unit) {
        this.unitNameInput.control.setValue(unit.information.name);
        this.selectLanguageInput.control.setValue(unit.information.language);
        this.selectCategoryInput.control.setValue(unit.information.category);
        this.shortDescriptionInput.control.setValue(unit.information.shortDescription);
        this.longDescriptionInput.control.setValue(unit.information.longDescription);
        this.ageRangeInput.control.setValue(unit.information.ageRange);
        this.selectThemeInput.control.setValue(unit.information.theme);
        this.selectTypeInput.control.setValue(unit.type);
        this.selectTypeInput.control.disable();

        const tags: any[] = [];
        unit.information.tags.forEach(t => {
            tags.push({
                display: t,
                value: t,
            });
        });

        this.tagsInput.control.setValue(tags);
        this.coverInput.control.setValue(unit.information.cover);

        const educationalContext: any[] = [];
        unit.information.educationalContext.forEach(t => {
            educationalContext.push({
                display: findEducationalContextByKeyAndLanguage(
                    t,
                    this.translate.getBrowserLang() as Language
                )?.name,
                value: t,
            });
        });

        this.educationalContextInput.control.setValue(educationalContext);

        if (!this.isEditableUnit()) {
            this.unitNameInput.control.disable();
            this.selectLanguageInput.control.disable();
            this.selectCategoryInput.control.disable();
            this.shortDescriptionInput.control.disable();
            this.longDescriptionInput.control.disable();
            this.coverInput.control.disable();
            this.tagsInput.control.disable();
            this.ageRangeInput.control.disable();
            this.educationalContextInput.control.disable();
            this.selectThemeInput.control.disable();
        }
    }

    private loadForm() {
        this.updateUnitInfoForm = this.formBuilder.group({
            name: this.unitNameInput.control,
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

    isEditableUnit(): boolean {
        return canEditUnit(this.unit);
    }

    get formControls() {
        return this.updateUnitInfoForm.controls;
    }

    update() {
        this.isSubmitted = true;

        if (this.updateUnitInfoForm.invalid) {
            this.actionResult.emit({
                messageKey: 'messages.form_error.message',
                type: ActionResultEventType.ERROR,
            });

            this.updateUnitInfoForm.markAllAsTouched();
            return;
        } else {
            this.allowSubmit = false;
            const updateUnitInfoBean: UpdateUnitInfoModel = this.createModel(
                this.updateUnitInfoForm.value
            );

            this.unitHandler.updateUnitInfo(this.unit.id, updateUnitInfoBean).subscribe(
                (unit: Unit) => {
                    this.actionResult.emit({
                        messageKey: 'units.tab_unit_info.messages.update_unit.ok.message',
                        type: ActionResultEventType.SUCCESS,
                        data: unit.id,
                    });

                    this.allowSubmit = true;
                },
                (errorResponse: HttpErrorResponse) => {
                    this.formErrorService.handleError(errorResponse);
                    this.allowSubmit = true;
                }
            );
        }
    }

    private createModel(value: any): UpdateUnitInfoModel {
        const updateUnitInfoBean: UpdateUnitInfoModel = value as UpdateUnitInfoModel;

        if (updateUnitInfoBean.tags.length > 0) {
            updateUnitInfoBean.tags = updateUnitInfoBean.tags.map(t => {
                return t.display;
            });
        } else updateUnitInfoBean.tags = [];

        if (updateUnitInfoBean.educationalContext.length > 0) {
            const edContextArray: number[] = [];

            updateUnitInfoBean.educationalContext.forEach(element => {
                edContextArray.push(element.value);
            });

            updateUnitInfoBean.educationalContext = edContextArray;
        } else updateUnitInfoBean.educationalContext = [];

        return updateUnitInfoBean;
    }

    showThemeInfo() {
        window.open(this.themeService.getThemeOrDefault().unitThemesUrl, '_blank');
    }
}
