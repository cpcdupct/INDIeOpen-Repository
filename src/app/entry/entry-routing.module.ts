import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryModule } from './entry.module';

import * as entryContainers from './containers';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        data: {},
        canActivate: [],
        component: entryContainers.EntryComponent,
    },
];

/**
 * Entry routing module
 */
@NgModule({
    imports: [EntryModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class EntryRoutingModule {}
