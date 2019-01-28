import { Component, Input, OnInit } from '@angular/core';
import { BookableService } from '../../../bookables/services/bookable.service';
import { LinkMutationService } from '../../../../shared/services/link-mutation.service';

/**
 * Like a app-relations for a single relation specialised in linking a bookable with a booking
 */
@Component({
    selector: 'app-select-bookable',
    templateUrl: './select-bookable.component.html',
    styleUrls: ['./select-bookable.component.scss'],
})
export class SelectBookableComponent implements OnInit {

    @Input() booking;
    @Input() placeholder: string;

    public bookable;

    constructor(public bookableService: BookableService, public linkMutationService: LinkMutationService) {
    }

    ngOnInit() {
        this.bookable = this.booking && this.booking.bookables.length ? this.booking.bookables[0] : null;
    }

    public update(newBookable) {

        if (!this.booking) {
            return;
        }

        const oldBookable = this.bookable;

        if (newBookable && !oldBookable) {
            this.linkMutationService.link(this.booking, newBookable).subscribe();
        } else if (!newBookable && oldBookable) {
            this.linkMutationService.unlink(this.booking, oldBookable).subscribe();
        }

        this.bookable = newBookable;
    }

}
