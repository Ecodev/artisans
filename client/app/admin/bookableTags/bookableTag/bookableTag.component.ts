import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../../natural/classes/AbstractDetail';
import { AlertService } from '../../../natural/components/alert/alert.service';
import {
    BookableTag,
    BookableTagVariables,
    CreateBookableTag,
    CreateBookableTagVariables,
    DeleteBookableTags,
    UpdateBookableTag,
    UpdateBookableTagVariables,
} from '../../../shared/generated-types';
import { BookableTagService } from '../services/bookableTag.service';

@Component({
    selector: 'app-bookable-tag',
    templateUrl: './bookableTag.component.html',
    styleUrls: ['./bookableTag.component.scss'],
})
export class BookableTagComponent
    extends AbstractDetail<BookableTag['bookableTag'],
        BookableTagVariables,
        CreateBookableTag['createBookableTag'],
        CreateBookableTagVariables,
        UpdateBookableTag['updateBookableTag'],
        UpdateBookableTagVariables,
        DeleteBookableTags> {

    constructor(alertService: AlertService,
                bookableTagService: BookableTagService,
                router: Router,
                route: ActivatedRoute,
                public tagService: BookableTagService,
    ) {
        super('bookableTag', bookableTagService, alertService, router, route);
    }
}
