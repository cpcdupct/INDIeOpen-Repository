import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

import * as videosContainers from './containers';
import { VideosModule } from './videos.module';

export const ROUTES: Routes = [
    {
        path: '',
        data: { title: 'videos.my_videos.title' },
        canActivate: [AuthGuard],
        component: videosContainers.VideosComponent,
    },
    {
        path: 'create',
        data: { title: 'videos.create.title' },
        canActivate: [AuthGuard],
        component: videosContainers.CreateVideoComponent,
    },
    {
        path: ':id/edit',
        data: { title: 'videos.edit.title' },
        canActivate: [AuthGuard],
        component: videosContainers.CreateVideoComponent,
    },
];

@NgModule({
    imports: [VideosModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class VideosRoutingModule {}
