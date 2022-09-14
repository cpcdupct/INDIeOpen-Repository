import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import * as coursesComponents from './components';
import * as coursesContainers from './containers';
import { modals } from './modals';

/**
 * Course feature module. In this module, the following aspects are covered:
 *  * List of user's courses
 *  * Create and modify courses
 */
@NgModule({
    imports: [SharedModule],
    declarations: [...coursesComponents.components, ...coursesContainers.containers, modals],
    entryComponents: [modals],
    exports: [],
})
export class CoursesModule {}
