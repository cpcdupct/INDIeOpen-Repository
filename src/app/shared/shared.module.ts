import { MatChipsModule } from '@angular/material/chips';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxMaterialRatingModule } from 'ngx-material-rating';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TagInputModule } from 'ngx-chips';
import { components } from './components';
import { directives } from './directives';
import { fontAwesomeBrandsIcons } from './icons/icons.font-awesome-brands';
import { fontAwesomeRegularIcons } from './icons/icons.font-awesome-regular';
import { fontAwesomeSolidIcons } from './icons/icons.font-awesome-solid';
import { modals } from './modals';
import { pipes } from './pipes';
import { MatPaginatorIntlService } from './services';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

const thirdParty = [
    FontAwesomeModule,
    NgbModule,
    TranslateModule,
    TagInputModule,
    NgSelectModule,
    NgxSliderModule,
    NgxMaterialRatingModule,
    MatRadioModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
];
const commonModules = [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
];

@NgModule({
    declarations: [...pipes, ...modals, ...components, ...directives],
    imports: [...commonModules, ...thirdParty],
    exports: [...commonModules, ...pipes, ...thirdParty, ...components, ...modals, ...directives],
    entryComponents: [...modals],
    providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlService }],
})
export class SharedModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(
            fontAwesomeSolidIcons,
            fontAwesomeRegularIcons,
            fontAwesomeBrandsIcons
        );
    }
}
