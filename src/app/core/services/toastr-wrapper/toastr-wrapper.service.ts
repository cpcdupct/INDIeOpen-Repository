import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Service that handles the creation and show of Toasts with localized messages to the user
 */
@Injectable({
    providedIn: 'root',
})
export class ToastrWrapperService {
    constructor(private toastrService: ToastrService, private translateService: TranslateService) {}

    /**
     * Show a info toast with message and title localized
     *
     * @param message i18n key corresponding to the message
     * @param title i18n key corresponding to the title
     */
    public info(message: string, title: string) {
        this.toastrService.info(
            this.translateService.instant(message),
            this.translateService.instant(title)
        );
    }

    /**
     * Show a success toast with message and title localized
     *
     * @param message i18n key corresponding to the message
     * @param title i18n key corresponding to the title
     */
    public success(message: string, title: string) {
        this.toastrService.success(
            this.translateService.instant(message),
            this.translateService.instant(title)
        );
    }

    /**
     * Show a warning toast with message and title localized
     *
     * @param message i18n key corresponding to the message
     * @param title i18n key corresponding to the title
     */
    public warning(message: string, title: string) {
        this.toastrService.warning(
            this.translateService.instant(message),
            this.translateService.instant(title)
        );
    }

    /**
     * Show a error toast with message and title localized
     *
     * @param message i18n key corresponding to the message
     * @param title i18n key corresponding to the title
     */
    public error(message: string, title: string) {
        this.toastrService.error(
            this.translateService.instant(message),
            this.translateService.instant(title)
        );
    }
}
