import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import * as unitsComponents from './components';
import * as unitsContainers from './containers';
import * as unitsModals from './modals';

@NgModule({
    imports: [SharedModule],
    declarations: [
        ...unitsContainers.containers,
        ...unitsComponents.components,
        ...unitsModals.modals,
    ],
    exports: [],
    entryComponents: [...unitsModals.modals],
})
export class UnitsModule {}
