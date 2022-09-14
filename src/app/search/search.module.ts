import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { components } from './components';
import { containers } from './containers';
import { AuthorFilterComponent } from './components/author-filter/author-filter.component';

/**
 * Search feature module. It provides searching units functionality.
 */
@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [...containers, ...components, AuthorFilterComponent],
    exports: [],
})
export class SearchModule {}
