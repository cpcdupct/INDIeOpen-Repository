import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { components, entryComponents } from './components';
import { containers } from './containers';

/**
 * Navigation feature module that has all the components that provide navigation in the application.
 */
@NgModule({
    declarations: [...containers, ...components, ...entryComponents],
    imports: [SharedModule],
    providers: [],
    exports: [...containers],
    entryComponents: [...entryComponents],
})
export class NavigationModule {}
