import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Containers */
import * as exploreContainers from './containers';
import { ExploreModule } from './explore.module';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        data: { title: 'explore.title' },
        canActivate: [],
        component: exploreContainers.ExploreComponent,
    },
];

/**
 * Explore routing module
 */
@NgModule({
    imports: [ExploreModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class ExploreRoutingModule {}
