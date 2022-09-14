import { Injectable } from '@angular/core';
import { ActionResultEvent, ActionResultEventType } from '@core/models';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from '../../models';

/**
 * Service to create and manage Alerts in the app
 */
@Injectable({ providedIn: 'root' })
export class AlertsService {
    /** Alert shown subject */
    private subject = new Subject<Alert>();
    /** Default Alert id */
    private defaultId = 'default-alert';

    constructor(private translateService: TranslateService) {}

    /**
     * Enable subscribing to alerts observable
     *
     * @param id Alert id
     */
    onAlert(id = this.defaultId): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    /**
     * Show an alert with an event data with options
     *
     * @param eventData Alert data
     * @param options Alert options
     */
    showAlert(eventData: ActionResultEvent, options?: any) {
        const type: AlertType = this.getTypeFromActionResultType(eventData.type);

        this.alert(
            new Alert({
                ...options,
                type,
                message: this.translateService.instant(eventData.messageKey),
            })
        );
    }

    /**
     * Get the type of Alert to be shown based on the type of the action result event
     *
     * @param type Event type
     */
    getTypeFromActionResultType(type: ActionResultEventType): AlertType {
        switch (type) {
            case ActionResultEventType.INFO:
                return AlertType.Info;
            case ActionResultEventType.ERROR:
                return AlertType.Error;
            case ActionResultEventType.SUCCESS:
                return AlertType.Success;
            case ActionResultEventType.WARNING:
                return AlertType.Warning;
        }
    }

    /**
     * Show a success alert with a message and options
     *
     * @param messageKey Message i18n key
     * @param options Alert options
     */
    success(messageKey: string, options?: any) {
        const message = this.translateService.instant(messageKey);
        this.alert(new Alert({ ...options, type: AlertType.Success, message }));
    }

    /**
     * Show an error alert with a message and options
     *
     * @param messageKey Message i18n key
     * @param options Alert options
     */
    error(messageKey: string, options?: any) {
        const message = this.translateService.instant(messageKey);
        this.alert(new Alert({ ...options, type: AlertType.Error, message }));
    }

    /**
     * Show an info alert with a message and options
     *
     * @param messageKey Message i18n key
     * @param options Alert options
     */
    info(messageKey: string, options?: any) {
        const message = this.translateService.instant(messageKey);
        this.alert(new Alert({ ...options, type: AlertType.Info, message }));
    }

    /**
     * Show a warn alert with a message and options
     *
     * @param messageKey Message i18n key
     * @param options Alert options
     */
    warn(messageKey: string, options?: any) {
        const message = this.translateService.instant(messageKey);
        this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
    }

    /**
     * Show an alert based on the information in the Alert model
     *
     * @param alert Alert instance
     */
    private alert(alert: Alert) {
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert);
    }

    /**
     * Clear a shown alert by Id
     *
     * @param id Alert id
     */
    clear(id = this.defaultId) {
        this.subject.next(new Alert({ id }));
    }
}
