import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalModule } from './legal.module';

import * as legalContainers from './containers';

/** Routes */
export const ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/contact',
    },
    {
        path: 'contact',
        data: { title: 'legal.contact.title' },
        component: legalContainers.ContactComponent,
    },
    {
        path: 'data',
        data: { title: 'legal.data.short-title' },
        component: legalContainers.DataComponent,
    },
    {
        path: 'notice',
        data: { title: 'legal.notice.title' },
        component: legalContainers.NoticeComponent,
    },
];

/**
 * Legal routing module
 */
@NgModule({
    imports: [LegalModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class LegalRoutingModule {}
