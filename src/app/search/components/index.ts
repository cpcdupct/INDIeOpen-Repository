import { AgeRangeFilterComponent } from './age-range-filter/age-range-filter.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { SearchFilterCheckComponent } from './search-filter-check/search-filter-check.component';
import { SearchFilterRadioComponent } from './search-filter-radio/search-filter-radio.component';
import { SearchItemComponent } from './search-item/search-item.component';

export const components = [
    AgeRangeFilterComponent,
    SearchItemComponent,
    SearchFilterRadioComponent,
    SearchFilterCheckComponent,
    CategoryFilterComponent,
];

export * from './age-range-filter/age-range-filter.component';
export * from './search-item/search-item.component';
export * from './search-filter-radio/search-filter-radio.component';
export * from './search-filter-check/search-filter-check.component';
export * from './category-filter/category-filter.component';
