import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import {
    AuthService,
    ChangeThemeService,
    GlobalErrorHandlerService,
    GlobalHttpInterceptorService,
} from '@core/services';
import { tokenRefresher, themeInitializer } from 'app/app.initializer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TagInputModule } from 'ngx-chips';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from './navigation/navigation.module';
import { environment } from 'environments/environment';

/**
 * Angular main module declaration
 */
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        ClipboardModule,
        AppRoutingModule,
        NgxSliderModule,
        FormsModule,
        CoreModule,
        NavigationModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgSelectModule,
        TagInputModule,
        ToastrModule.forRoot({
            timeOut: 6000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
            easeTime: 1000,
        }),
        ToastContainerModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        NgbModule,
    ],
    providers: [
        CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true },
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
        { provide: APP_INITIALIZER, useFactory: tokenRefresher, multi: true, deps: [AuthService] },
        {
            provide: APP_INITIALIZER,
            useFactory: themeInitializer,
            multi: true,
            deps: [ChangeThemeService],
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

/**
 * Function that adds a cache buster parameter in i18n assets. Only applied in production mode.
 *
 * @param http Http Client module instance
 */
export function HttpLoaderFactory(http: HttpClient) {
    return environment.production
        ? new TranslateHttpLoader(http)
        : new TranslateHttpLoader(http, '/assets/i18n/', '.json?cb=' + environment.hash);
}
