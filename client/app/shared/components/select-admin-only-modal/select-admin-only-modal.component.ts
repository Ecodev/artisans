import { Component, OnInit } from '@angular/core';
import { BookableService } from '../../../admin/bookables/services/bookable.service';

@Component({
    selector: 'app-select-admin-only-modal',
    templateUrl: './select-admin-only-modal.component.html',
})
export class SelectAdminOnlyModalComponent implements OnInit {

    public selection;
    public variables = BookableService.adminByTag('6008');

    constructor(public bookableService: BookableService) {
    }

    ngOnInit() {
    }

}
