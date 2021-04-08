import {Component, Injector, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NaturalAbstractList, SortingOrder} from '@ecodev/natural';
import {CommentService} from '../../../admin/comments/services/comment.service';
import {
    Comments,
    CommentSortingField,
    CommentsVariables,
    Event_event,
    Events_events_items,
    News_news,
    Newses_newses_items,
} from '../../../shared/generated-types';
import {PermissionsService} from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent extends NaturalAbstractList<CommentService> implements OnInit, OnChanges {
    /**
     * Event related to displayed comments
     */
    @Input() public event?: Event_event | Events_events_items;

    /**
     * News related to displayed comments
     */
    @Input() public news?: News_news | Newses_newses_items;

    /**
     * Antichronologic sorting by creation date to no change in case of update
     */
    public defaultSorting = [{field: CommentSortingField.creationDate, order: SortingOrder.DESC}];

    public publishing = false;

    public newCommentValue = '';

    constructor(service: CommentService, injector: Injector, public readonly permissionsService: PermissionsService) {
        super(service, injector);
        this.persistSearch = false;
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.event) {
            this.variablesManager.set('partial-variables', {
                filter: {groups: [{conditions: [{event: {in: {values: [this.event.id]}}}]}]},
            });
        }

        if (this.news) {
            this.variablesManager.set('partial-variables', {
                filter: {groups: [{conditions: [{news: {in: {values: [this.news.id]}}}]}]},
            });
        }
    }

    public addComment(): void {
        this.publishing = true;
        const comment = {
            description: this.newCommentValue,
            event: this.event,
            news: this.news,
        };

        this.service.create(comment).subscribe(() => {
            this.publishing = false;
            this.newCommentValue = '';
            this.alertService.info('Votre message a bien été publié');
        });
    }
}
