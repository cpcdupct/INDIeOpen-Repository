import { ApiService } from './api/api.service';
import { AuthService } from './auth/auth.service';
import { CategoryService } from './category/category.service';
import { ChangeThemeService } from './change-theme/change-theme.service';
import { CipherService } from './cipher/cipher.service';
import { CoursesService } from './courses/courses.service';
import { FormErrorHandlerService } from './error-handlers/form-error-handler.service';
import { GlobalErrorHandlerService } from './error-handlers/global-error-handler.service';
import { GlobalHttpInterceptorService } from './error-handlers/global-interceptor.service';
import { OriginService } from './origin/origin.service';
import { RatingService } from './rating/rating.service';
import { ResizeService } from './resize/resize.service';
import { URLResourceService } from './resources/resources.service';
import { TenantService } from './tenant/tenant.service';
import { ToastrWrapperService } from './toastr-wrapper/toastr-wrapper.service';
import { UnitsService } from './units/units.service';

export const services = [
    ApiService,
    CipherService,
    RatingService,
    CoursesService,
    URLResourceService,
    UnitsService,
    AuthService,
    ResizeService,
    CategoryService,
    FormErrorHandlerService,
    ToastrWrapperService,
    GlobalErrorHandlerService,
    OriginService,
    GlobalHttpInterceptorService,
    ChangeThemeService,
    TenantService,
];

export * from './api/api.service';
export * from './courses/courses.service';
export * from './auth/auth.service';
export * from './category/category.service';
export * from './change-theme/change-theme.service';
export * from './cipher/cipher.service';
export * from './error-handlers/form-error-handler.service';
export * from './error-handlers/global-error-handler.service';
export * from './error-handlers/global-interceptor.service';
export * from './rating/rating.service';
export * from './resize/resize.service';
export * from './resources/resources.service';
export * from './toastr-wrapper/toastr-wrapper.service';
export * from './units/units.service';
export * from './origin/origin.service';
export * from './tenant/tenant.service';
