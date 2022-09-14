import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import * as entryContainers from './containers';

/**
 * Entry featur module. This module handles the authentication for a login provider.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [...entryContainers.containers],
})
export class EntryModule {}
