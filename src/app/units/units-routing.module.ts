import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

import { RouteData } from '../navigation/models';

import * as unitsContainers from './containers';
import { UnitsModule } from './units.module';

export const ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'units.my_units.title',
            breadcrumbs: [
                {
                    key: 'units.my_units.title',
                    active: true,
                },
            ],
        } as RouteData,
        canActivate: [AuthGuard],
        component: unitsContainers.UnitsComponent,
    },
    {
        path: 'create',
        data: {
            title: 'units.create_unit.title',
            breadcrumbs: [
                {
                    key: 'units.my_units.title',
                    active: false,
                    link: '/units',
                },
                {
                    key: 'units.create_unit.title',
                    active: true,
                },
            ],
        } as RouteData,
        canActivate: [AuthGuard],
        component: unitsContainers.CreateUnitComponent,
    },
    {
        path: ':id/panel',
        data: {
            title: 'units.unit_panel.title',
            breadcrumbs: [
                {
                    key: 'units.my_units.title',
                    active: false,
                    link: '/units',
                },
                {
                    key: 'units.unit_panel.title',
                    active: true,
                },
            ],
        } as RouteData,
        canActivate: [AuthGuard],
        component: unitsContainers.UnitPanelComponent,
    },
];

@NgModule({
    imports: [UnitsModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class UnitsRoutingModule {}
