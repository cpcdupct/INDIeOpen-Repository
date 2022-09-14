import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesModule } from './courses.module';

import * as coursesContainers from './containers';
import { AuthGuard } from '@core/guards/auth.guard';

/**
 * Course routes
 */
export const ROUTES: Routes = [
    {
        path: '',
        data: { title: 'courses.my_courses.title' },
        canActivate: [AuthGuard],
        component: coursesContainers.CoursesComponent,
    },
    {
        path: 'create',
        data: { title: 'courses.create.title' },
        canActivate: [AuthGuard],
        component: coursesContainers.CreateCourseComponent,
    },
    {
        path: ':id/edit',
        data: { title: 'courses.edit.title' },
        canActivate: [AuthGuard],
        component: coursesContainers.CreateCourseComponent,
    },
];

/**
 * Course routing module
 */
@NgModule({
    imports: [CoursesModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class CoursesRoutingmodule {}
