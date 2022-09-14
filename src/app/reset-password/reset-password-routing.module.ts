import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as containers from './containers';
import { ResetPasswordModule } from './reset-password.module';

export const ROUTES: Routes = [
    {
        path: '',
        data: { title: 'reset-password.title' },
        component: containers.ResetPasswordComponent,
    },
];

/**
 * Reset password routing module
 */
@NgModule({
    imports: [ResetPasswordModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class ResetPasswordRoutingModule {}
