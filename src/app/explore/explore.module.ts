import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import * as exploreComponents from './components';
import * as exploreContainers from './containers';

/**
 * Explore feature module. This module covers the main page of the application. Carousels, welcome, recent units...
 */
@NgModule({
    providers: [],
    imports: [SharedModule],
    declarations: [...exploreContainers.containers, ...exploreComponents.components],
    exports: [...exploreContainers.containers, ...exploreComponents.components],
    entryComponents: [...exploreComponents.components],
})
export class ExploreModule {}
