import {Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {NaturalAbstractList, NaturalIconDirective, SortingOrder} from '@ecodev/natural';
import {CommentService} from '../../../admin/comments/services/comment.service';
import {CommentSortingField, Event, Events, News, Newses} from '../../../shared/generated-types';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrl: './comment-list.component.scss',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
    ],
})
export class CommentListComponent extends NaturalAbstractList<CommentService> implements OnInit, OnChanges {
    public readonly permissionsService = inject(PermissionsService);

    /**
     * Event related to displayed comments
     */
    @Input() public event?: Event['event'] | Events['events']['items'][0];

    /**
     * News related to displayed comments
     */
    @Input() public news?: News['news'] | Newses['newses']['items'][0];

    /**
     * Antichronologic sorting by creation date to no change in case of update
     */
    public override defaultSorting = [{field: CommentSortingField.creationDate, order: SortingOrder.DESC}];

    public publishing = false;

    public newCommentValue = '';

    public constructor() {
        super(inject(CommentService));
        this.persistSearch = false;
    }

    public ngOnChanges(): void {
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
