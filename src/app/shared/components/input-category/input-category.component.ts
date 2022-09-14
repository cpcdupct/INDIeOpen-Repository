import { Component, OnInit } from '@angular/core';
import { Language } from '@core/models';
import { CategoryService } from '@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CategoryPickedEvent, PickCategoryComponent } from '@shared/modals';

import { FormInputComponent } from '../form-input/form-input.component';

/**
 * Input category
 */
@Component({
    selector: 'io-input-category',
    templateUrl: './input-category.component.html',
    styleUrls: ['./input-category.component.scss'],
})
export class InputCategoryComponent extends FormInputComponent implements OnInit {
    /** Cateogry selected */
    categorySelected!: string;
    /** Category text */
    categoryText!: string;

    constructor(
        private modalService: NgbModal,
        private translateService: TranslateService,
        private categoryService: CategoryService
    ) {
        super();
    }

    /**
     * @inheritdoc
     *
     * Select the input's category from the category key value
     */
    ngOnInit(): void {
        this.categorySelected = this.data.control.value.toString();
        this.categoryText = this.categoryService.findTranslationForCategory(
            this.categorySelected,
            this.translateService.getBrowserLang() as Language
        );
    }

    /**
     * Show the pick category modal an get the category selected
     */
    showPickCategoryModal() {
        const modalRef = this.modalService.open(
            PickCategoryComponent,
            PickCategoryComponent.options
        );

        modalRef.result
            .then((res: CategoryPickedEvent) => {
                this.categorySelected = res.key;
                this.categoryText = res.name;
                this.data.control.setValue(res.key);
            })
            .catch(err => {});
    }
}
