import { Component, OnInit } from '@angular/core';
import { CategoryResource, Language, Path } from '@core/models';
import { CategoryService } from '@core/services';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

/** Category picked event */
export interface CategoryPickedEvent {
    /** Category key */
    key: string;
    /** Category name */
    name: string;
}

/** Category item */
interface CategoryItem {
    /** Category path between parent and children */
    paths: Path[];
    /** Category resource */
    resource: CategoryResource;
}

/**
 * Pick a category modal
 */
@Component({
    selector: 'io-pick-category',
    templateUrl: './pick-category.component.html',
    styleUrls: ['./pick-category.component.scss'],
})
export class PickCategoryComponent implements OnInit {
    /** Modal options */
    public static options: NgbModalOptions = {
        keyboard: true,
        windowClass: 'modal-holder',
        size: 'xl',
    };

    /** Array of categories */
    categories: CategoryItem[] = [];

    /** Search term */
    term = '';

    constructor(
        private categoryService: CategoryService,
        public activeModal: NgbActiveModal,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {}

    /**
     * Input category term change event listener
     *
     * @param event Event instance
     */
    onChange(event: any) {
        if (this.term.length >= 3) {
            this.categories = [];

            const categoriesFound = this.categoryService.searchCategories(
                this.term,
                this.translateService.getBrowserLang() as Language
            );

            for (const category of categoriesFound) {
                this.categories.push({
                    resource: category,
                    paths: this.getPaths(category.key),
                });
            }
        } else {
            this.categories = [];
        }
    }

    /**
     * Mark the category item as selected
     *
     * @param Event containing the selected category option
     */
    categorySelected(event: any) {
        let key = event.option.id.split('-')[1];
        let name = event.option.value;
        const result: CategoryPickedEvent = { key, name };
        this.activeModal.close(result);
    }

    /**
     * Mark an item category as selected
     *
     * @param item Selected item
     */
    selectCategory(item: CategoryItem) {
        const result: CategoryPickedEvent = {
            key: item.resource.key,
            name: item.resource.translation,
        };

        this.activeModal.close(result);
    }

    /**
     * Close the modal and not select a Category
     */
    cancel() {
        this.activeModal.close();
    }

    /**
     * Get the paths of a given Category based on the category key
     *
     * @param key Category key
     */
    getPaths(key: string): Path[] {
        return this.categoryService.getCategoryPaths(key);
    }
}
