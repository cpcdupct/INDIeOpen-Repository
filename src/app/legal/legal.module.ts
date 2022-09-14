import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { containers } from './containers';

/**
 * Legal feature module. It covers the legal text in the application.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [...containers],
    exports: [...containers],
})
export class LegalModule {}
