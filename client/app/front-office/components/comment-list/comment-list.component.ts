import {Component, inject, input, OnChanges, OnInit} from '@angular/core';
import {NaturalAbstractList, NaturalIconDirective, SortingOrder} from '@ecodev/natural';
import {CommentService} from '../../../admin/comments/services/comment.service';
import {CommentSortingField, EventQuery, EventsQuery, NewsQuery, NewsesQuery} from '../../../shared/generated-types';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {AsyncPipe, DatePipe} from '@angular/common';

@Component({
    selector: 'app-comment-list',
    imports: [
        AsyncPipe,
        DatePipe,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        MatButton,
        MatIconButton,
        RouterLink,
        MatIcon,
        NaturalIconDirective,
    ],
    templateUrl: './comment-list.component.html',
    styleUrl: './comment-list.component.scss',
})
export class CommentListComponent extends NaturalAbstractList<CommentService> implements OnInit, OnChanges {
    protected readonly permissionsService = inject(PermissionsService);

    /**
     * Event related to displayed comments
     */
    public readonly event = input<EventQuery['event'] | EventsQuery['events']['items'][0]>();

    /**
     * News related to displayed comments
     */
    public readonly news = input<NewsQuery['news'] | NewsesQuery['newses']['items'][0]>();

    /**
     * Antichronologic sorting by creation date to no change in case of update
     */
    public override defaultSorting = [{field: CommentSortingField.creationDate, order: SortingOrder.DESC}];

    protected publishing = false;

    protected newCommentValue = '';

    public constructor() {
        super(inject(CommentService));
        this.persistSearch = false;
    }

    public ngOnChanges(): void {
        const event = this.event();
        if (event) {
            this.variablesManager.set('partial-variables', {
                filter: {groups: [{conditions: [{event: {in: {values: [event.id]}}}]}]},
            });
        }

        const news = this.news();
        if (news) {
            this.variablesManager.set('partial-variables', {
                filter: {groups: [{conditions: [{news: {in: {values: [news.id]}}}]}]},
            });
        }
    }

    protected addComment(): void {
        this.publishing = true;
        const comment = {
            description: this.newCommentValue,
            event: this.event(),
            news: this.news(),
        };

        this.service.create(comment).subscribe(() => {
            this.publishing = false;
            this.newCommentValue = '';
            this.alertService.info('Votre message a bien été publié');
        });
    }
}
