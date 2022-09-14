import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { QuestionGroup, QuestionType } from '@core/models';
import { ToastrWrapperService } from '@core/services';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '@shared/components/alerts/alerts.service';
import { LoaderService } from '@shared/components/loader/loader.service';
import { FilterEvent, OrderFilter, PAGE_DEFAULT_PAGE, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { SelectQuestionTypeModalComponent } from '../../components';
import { QuestionItem } from '../../models';
import { QuestionsService } from '../../services';

interface RequestParams {
    type?: string;
    order?: string;
    group?: string;
}

@Component({
    selector: 'io-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit, AfterViewInit {
    /** Page element containing the QuesitonItem instances for pagination */
    questions$!: Observable<QuestionItem[]>;

    /** Page Request */
    page: number = PAGE_DEFAULT_PAGE;
    size: number = PAGE_DEFAULT_SIZE;
    total!: number;

    /** Request param */
    requestParams: RequestParams = {};

    /** Filters */
    orderFilter!: OrderFilter;
    groupFilter!: OrderFilter;
    questionTypeFilter!: OrderFilter;

    /** Last state */
    lastState!: any;
    numberOfElements = 0;
    /** Last page */
    lastPage: number = 0;

    constructor(
        private questionsService: QuestionsService,
        private router: Router,
        private route: ActivatedRoute,
        private loaderService: LoaderService,
        private modalService: NgbModal,
        private alertService: AlertsService,
        private toastrWrapper: ToastrWrapperService
    ) {
        this.lastState = this.router.getCurrentNavigation()?.extras.state;
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.loadRequestParameters(params);
            this.loadFilters();
            this.loadQuestions(1);
        });
    }

    ngAfterViewInit(): void {
        if (this.lastState) this.notifyState();
    }

    loadRequestParameters(params: ParamMap) {
        if (params.has('type')) this.requestParams.type = params.get('type') || undefined;
        else delete this.requestParams.type;

        if (params.has('order')) this.requestParams.order = params.get('order') || undefined;
        else delete this.requestParams.order;

        if (params.has('group')) this.requestParams.group = params.get('group') || undefined;
        else delete this.requestParams.group;
    }

    loadQuestions(page: number) {
        this.loaderService.loadingOn();
        // Fix incorrect page numbers
        if (page * this.size > this.total) page = this.lastPage;
        else if (page < 1) page = 1;
        this.questions$ = this.questionsService.findQuestions(page, this.getSearchParams()).pipe(
            tap(res => {
                this.total = res.length;
                this.numberOfElements = res.numberOfElements;
                this.page = page;
                this.lastPage =
                    Math.floor(this.total / this.size) + (this.total % this.size === 0 ? 0 : 1);
            }),

            map(res => res.items),
            finalize(() => this.loaderService.loadingOff())
        );
    }

    private getSearchParams() {
        let params: any = {};
        params = { ...params, ...this.requestParams };

        delete params.order;

        if (this.requestParams.order) {
            const order = this.orderFilter.items.find(o => o.key === this.requestParams.order);
            params.sort = order?.sort?.name + ',' + order?.sort?.order;
        }

        return params;
    }

    private loadFilters() {
        this.looadType(this.requestParams.type);
        this.loadOrderFilter(this.requestParams.order);
        this.loadGroupFilter(this.requestParams.group);
    }

    private looadType(type: string | undefined) {
        this.questionTypeFilter = {
            key: 'type',
            label: 'questions.show-type',
            selected: type !== undefined ? type : 'ALL_TYPES',
            items: [
                {
                    key: 'ALL_TYPES',
                    label: 'questions.types.all',
                },
                {
                    key: 'SingleAnswer',
                    label: 'questions.types.singleAnswer',
                },
                {
                    key: 'MultipleAnswer',
                    label: 'questions.types.multipleAnswer',
                },
                {
                    key: 'TrueFalse',
                    label: 'questions.types.trueFalseAnswer',
                },
            ],
        };
    }

    private loadOrderFilter(order: string | undefined) {
        this.orderFilter = {
            key: 'order',
            label: 'questions.order-by',
            selected: order !== undefined ? order : 'A_Z',
            items: [
                {
                    label: 'search.orders.a_z',
                    key: 'A_Z',
                    sort: {
                        name: 'questionText',
                        order: 'asc',
                    },
                },
                {
                    label: 'search.orders.z_a',
                    key: 'Z_A',
                    sort: {
                        name: 'questionText',
                        order: 'desc',
                    },
                },
            ],
        };
    }

    private loadGroupFilter(group: string | undefined) {
        this.questionsService.getlistOfQuestionGroups().subscribe(
            (groups: QuestionGroup[]) => {
                const items: any[] = [
                    {
                        label: 'questions.groups.all',
                        key: 'ALL',
                    },
                ];

                groups.forEach(groupItem => {
                    items.push({
                        label: groupItem.name,
                        key: groupItem.key,
                    });
                });

                this.groupFilter = {
                    key: 'group',
                    label: 'questions.show-group',
                    selected: group !== undefined ? group : 'ALL',
                    items,
                };
            },
            err => {
                console.error(err);
            }
        );
    }

    onFilterSelected(filter: FilterEvent) {
        const params: any = {};
        params[filter.filterKey] = filter.filterItemKeys[0];

        this.router.navigate(['/questions'], {
            queryParamsHandling: 'merge',
            queryParams: params,
        });
    }

    selectTypeAndCreate() {
        this.modalService
            .open(SelectQuestionTypeModalComponent, SelectQuestionTypeModalComponent.options)
            .result.then((result: QuestionType) => {
                if (result) {
                    this.goToCreateQuestion(result);
                }
            })
            .catch(err => {
                if (err !== ModalDismissReasons.ESC && err !== ModalDismissReasons.BACKDROP_CLICK)
                    this.toastrWrapper.warning('questions.messages.select_type', 'common.warning');
            });
    }

    goToCreateQuestion(result: QuestionType) {
        this.router.navigate(['/questions/create'], {
            queryParams: {
                type: result,
            },
        });
    }

    onQuestionDeleted(deletedItemId: string) {
        this.alertService.success('questions.messages.deleted_question.message');
        this.loadQuestions(1);
    }

    onUsedQuestion(usedQuestion: string) {
        this.alertService.error('questions.messages.question_used.message', {
            autoClose: false,
            keepAfterRouteChange: false,
        });
    }

    private notifyState() {
        if (this.lastState.question === 'UPDATE') {
            this.alertService.success('questions.messages.updated_question.message');
        } else if (this.lastState.question === 'CREATE')
            this.alertService.success('questions.messages.created_question.message');
    }

    getElements(): number {
        return this.numberOfElements + (this.page - 1) * 5;
    }
}
