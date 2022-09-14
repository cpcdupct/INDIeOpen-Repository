import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import * as containers from './containers';

/**
 * Reset password feature module.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [...containers.containers],
})
export class ResetPasswordModule {}
