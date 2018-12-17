import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import {
    CreateBookableTagMutation,
    CreateBookableTagMutationVariables, DeleteBookableTagsMutation,
    BookableTagQuery,
    BookableTagQueryVariables,
    UpdateBookableTagMutation, UpdateBookableTagMutationVariables,
} from '../../../shared/generated-types';
import { BookableTagService } from '../services/bookableTag.service';


@Component({
    selector: 'app-bookable-tag',
    templateUrl: './bookableTag.component.html',
    styleUrls: ['./bookableTag.component.scss'],
})
export class BookableTagComponent
    extends AbstractDetail<BookableTagQuery['bookableTag'],
        BookableTagQueryVariables,
        CreateBookableTagMutation['createBookableTag'],
        CreateBookableTagMutationVariables,
        UpdateBookableTagMutation['updateBookableTag'],
        UpdateBookableTagMutationVariables,
        DeleteBookableTagsMutation> {

    constructor(alertService: AlertService,
                bookableTagService: BookableTagService,
                router: Router,
                route: ActivatedRoute,
                public tagService: BookableTagService,
    ) {
        super('bookableTag', bookableTagService, alertService, router, route);
    }
}
