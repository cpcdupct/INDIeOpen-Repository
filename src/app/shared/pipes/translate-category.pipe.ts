import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '@core/models';
import { CategoryService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';

/**
 * Pipe to get the translation of a Category in the current language
 */
@Pipe({
    name: 'translateCategory',
})
export class TranslateCategoryPipe implements PipeTransform {
    constructor(private translate: TranslateService, private categoryService: CategoryService) {}

    /**
     * Get the category name translated given a key
     *
     * @param categoryKey Category key
     */
    transform(categoryKey: string): string {
        // ToString needed, pipe automatically sets key to number
        return this.categoryService.findTranslationForCategory(
            categoryKey.toString(),
            this.translate.getBrowserLang() as Language
        );
    }
}
