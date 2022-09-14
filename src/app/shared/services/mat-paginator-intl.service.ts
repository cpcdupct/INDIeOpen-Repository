import { Injectable } from '@angular/core';
import { translate } from '@angular/localize/src/utils';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TokenResource } from '@core/models';
import { Video } from '@core/models/video';
import { ApiService, AuthService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { createPageResponse, Page, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class MatPaginatorIntlService extends MatPaginatorIntl {
    constructor(private translate: TranslateService) {
        super();
        this.translate.onLangChange.subscribe(() => {
            this.init();
        });
        this.init();
    }

    init() {
        this.itemsPerPageLabel = this.translate.instant('pagination.size');
        this.nextPageLabel = this.translate.instant('pagination.next');
        this.previousPageLabel = this.translate.instant('pagination.previous');
        this.firstPageLabel = this.translate.instant('pagination.first');
        this.lastPageLabel = this.translate.instant('pagination.last');
    }

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0)
            return this.translate.instant('pagination.range', { start: 0, end: 0, total: length });
        let start = page * pageSize;
        let end = Math.min(length, (page + 1) * pageSize);
        return this.translate.instant('pagination.range', { start, end, total: length });
    };
}
