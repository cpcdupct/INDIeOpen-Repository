import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouteData } from '../navigation/models';

import * as searchContainers from './containers';
import { SearchModule } from './search.module';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        data: {
            breadcrumbs: [
                {
                    active: true,
                    key: 'pages.search',
                },
            ],
            title: 'search.title',
        } as RouteData,
        canActivate: [],
        component: searchContainers.SearchComponent,
    },
];

/**
 * Search routing module
 */
@NgModule({
    imports: [SearchModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class SearchRoutingModule {}
