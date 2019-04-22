import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookableService } from '../../admin/bookables/services/bookable.service';
import { UserService } from '../../admin/users/services/user.service';
import { NaturalAbstractController } from '@ecodev/natural';

@Component({
    selector: 'app-bookable',
    templateUrl: './bookable.component.html',
    styleUrls: ['./bookable.component.scss'],
})
export class BookableComponent extends NaturalAbstractController implements OnInit {

    /**
     * If the booking is free / available for a new navigation
     */
    public isAvailable: boolean;

    public canAccessAdmin: boolean;

    public bookable;

    constructor(private bookableService: BookableService,
                private route: ActivatedRoute,
    ) {
        super();
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.bookable = data.bookable.model;
            if (this.bookable) {
                this.initForBookable();
            }
        });

    }

    private initForBookable() {
        const viewer = this.route.snapshot.data.viewer.model;
        this.canAccessAdmin = UserService.canAccessAdmin(viewer);
    }
}
