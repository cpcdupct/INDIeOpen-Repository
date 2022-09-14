import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

import * as userContainers from './containers';
import { UserModule } from './user.module';

export const ROUTES: Routes = [
    {
        path: '',
        data: { title: 'user.settings.title' },
        canActivate: [AuthGuard],
        component: userContainers.SettingsComponent,
    },
];

@NgModule({
    imports: [UserModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
