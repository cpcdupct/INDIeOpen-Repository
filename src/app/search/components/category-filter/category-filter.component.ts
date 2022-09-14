import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryResource, Language, Path } from '@core/models';
import { CategoryService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { FilterEvent } from '@shared/models';
import { GenericFilter } from 'app/search/models';

/** Category item in select */
interface CategoryItem {
    paths: Path[];
    resource: CategoryResource;
}

/**
 * Category filter selection
 */
@Component({
    selector: 'io-category-filter',
    templateUrl: './category-filter.component.html',
    styleUrls: ['./category-filter.component.scss'],
})
export class CategoryFilterComponent implements OnInit {
    /** Filter definition */
    filter: GenericFilter;

    /** Filter selected event */
    @Output()
    filterSelected = new EventEmitter<FilterEvent>();

    /** Category search results */
    results: CategoryItem[] = [];

    /** Category selected */
    itemSelected: CategoryItem | undefined;

    /** Searchbar text */
    name: string = '';

    constructor(
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private translateService: TranslateService,
        private eRef: ElementRef
    ) {
        this.filter = {
            key: 'category',
            label: 'search.filters.title.categories',
            selected: undefined,
        };
    }

    /**
     * @inheritdoc
     *
     * Select a category based on the query parameter
     */
    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            if (params.has('category')) {
                this.setItemSelected(params.get('category'));
            } else {
                this.itemSelected = undefined;
            }
        });
    }

    /** Set category selected from the selected category key
     *
     * @param selected selected value
     */
    private setItemSelected(selected: string | null) {
        if (selected === null) return;

        const categoryRes = this.categoryService.getTranslatedCategories(
            this.translateService.getBrowserLang() as Language,
            selected
        );

        if (categoryRes)
            this.itemSelected = {
                resource: categoryRes,
                paths: this.categoryService.getCategoryPaths(categoryRes.key),
            };
    }

    /**
     * Category changed event
     *
     * @param event Event instance
     */
    dataChanged(event: Event) {
        if (this.name.length >= 3) {
            this.results = [];

            const categoriesFound = this.categoryService.searchCategories(
                this.name,
                this.translateService.getBrowserLang() as Language
            );

            for (const category of categoriesFound) {
                this.results.push({
                    resource: category,
                    paths: this.categoryService.getCategoryPaths(category.key),
                });
            }
        } else {
            this.results = [];
        }
    }

    /**
     * Clear the search results when the user clicks outside the filter
     *
     * @param event Clickout event
     */
    @HostListener('document:click', ['$event'])
    @HostListener('touchend', ['$event'])
    clickout(event: Event) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.results = [];
            this.name = '';
        }
    }

    /**
     * Mark the category item as selected
     *
     * @param Event containing the selected category option
     */
    categorySelected(event: any) {
        let key = event.option.id.split('-')[1];
        this.results = [];
        this.name = '';
        this.emitEvent([key]);
        this.setItemSelected(key);
    }

    /** Clear selected category */
    clearSelected() {
        this.emitEvent([]);
        this.itemSelected = undefined;
    }

    /**
     * Emit filter value
     *
     * @param keys Selected items
     */
    private emitEvent(keys: string[]) {
        this.filterSelected.emit({
            filterKey: this.filter.key,
            filterItemKeys: keys,
        });
    }
}
