import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * Application routes that rely on module-routing components
 */
const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/explore',
    },
    {
        path: 'explore',
        loadChildren: () =>
            import('app/explore/explore-routing.module').then(m => m.ExploreRoutingModule),
    },
    {
        path: 'search',
        loadChildren: () =>
            import('app/search/search-routing.module').then(m => m.SearchRoutingModule),
    },
    {
        path: 'units',
        loadChildren: () =>
            import('app/units/units-routing.module').then(m => m.UnitsRoutingModule),
    },
    {
        path: 'questions',
        loadChildren: () =>
            import('app/questions/questions-routing.module').then(m => m.QuestionsRoutingModule),
    },
    {
        path: 'videos',
        loadChildren: () =>
            import('app/videos/videos-routing.module').then(m => m.VideosRoutingModule),
    },
    {
        path: 'user',
        loadChildren: () => import('app/user/user-routing.module').then(m => m.UserRoutingModule),
    },
    {
        path: 'entry',
        loadChildren: () =>
            import('app/entry/entry-routing.module').then(m => m.EntryRoutingModule),
    },
    {
        path: 'resetPassword',
        loadChildren: () =>
            import('app/reset-password/reset-password-routing.module').then(
                m => m.ResetPasswordRoutingModule
            ),
    },
    {
        path: 'courses',
        loadChildren: () =>
            import('app/courses/courses-routing.module').then(m => m.CoursesRoutingmodule),
    },
    {
        path: 'legal',
        loadChildren: () =>
            import('app/legal/legal-routing.module').then(m => m.LegalRoutingModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
