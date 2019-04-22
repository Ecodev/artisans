import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail, NaturalAlertService } from '@ecodev/natural';
import { BookableService } from '../services/bookable.service';
import {
    Bookable,
    BookableVariables,
    CreateBookable,
    CreateBookableVariables,
    CreateImage,
    UpdateBookable,
    UpdateBookableVariables,
} from '../../../shared/generated-types';
import { BookableTagService } from '../../bookableTags/services/bookableTag.service';
import { ImageService } from '../services/image.service';
import { AccountHierarchicConfiguration } from '../../AccountHierarchicConfiguration';

@Component({
    selector: 'app-bookable',
    templateUrl: './bookable.component.html',
    styleUrls: ['./bookable.component.scss'],
})
export class BookableComponent
    extends NaturalAbstractDetail<Bookable['bookable'],
        BookableVariables,
        CreateBookable['createBookable'],
        CreateBookableVariables,
        UpdateBookable['updateBookable'],
        UpdateBookableVariables,
        any> implements OnInit {

    public accountHierarchicConfig = AccountHierarchicConfiguration;

    constructor(alertService: NaturalAlertService,
                bookableService: BookableService,
                router: Router,
                route: ActivatedRoute,
                public bookableTagService: BookableTagService,
                public imageService: ImageService,
    ) {
        super('bookable', bookableService, alertService, router, route);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    public verify() {

        const partialBookable = {id: this.data.model.id, verificationDate: (new Date()).toISOString()};
        this.service.updatePartially(partialBookable).subscribe((bookable) => {
            this.form.patchValue(bookable);
        });

    }

    public newImage(image: CreateImage['createImage']) {

        const imageField = this.form.get('image');
        if (imageField) {
            imageField.setValue(image);
            if (this.data.model.id) {
                this.update();
            }
        }
    }
}
