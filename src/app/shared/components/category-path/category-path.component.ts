import { Component, Input, OnInit } from '@angular/core';
import { Language, Path } from '@core/models';
import { CategoryService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';

/**
 * Category leaf
 */
interface CategoryLeaf {
    key: string;
    translation: string;
}

@Component({
    selector: 'io-category-path',
    templateUrl: './category-path.component.html',
    styleUrls: ['./category-path.component.scss'],
})
export class CategoryPathComponent implements OnInit {
    @Input()
    category!: string;

    @Input()
    /** Category path */
    path!: Path;

    /** Tree of categories */
    tree: CategoryLeaf[] = [];

    constructor(
        private translateService: TranslateService,
        private categoryService: CategoryService
    ) {}

    /**
     * @inheritdoc
     *
     * Load translated paths
     */
    ngOnInit(): void {
        this.path.path.forEach(key => {
            this.tree.push({
                key,
                translation: this.categoryService.findTranslationForCategory(
                    key,
                    this.translateService.getBrowserLang() as Language
                ),
            });
        });
    }

    /**
     * Return a css class representing a category selected
     *
     * @param category category key
     */
    isSelected(category: string): string {
        if (category === this.category) return 'category category-selected';
        return 'category';
    }
}
