import { Component, OnInit } from '@angular/core';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { Bookables, BookablesVariables } from '../../generated-types';
import { SelectionModel } from '@angular/cdk/collections';
import { QueryVariablesManager } from '../../../natural/classes/QueryVariablesManager';
import { NaturalDataSource } from '../../../natural/classes/DataSource';
import { BookableTagService } from '../../../admin/bookableTags/services/bookableTag.service';

@Component({
    selector: 'app-select-admin-approved-modal',
    templateUrl: './select-admin-approved-modal.component.html',
})
export class SelectAdminApprovedModalComponent implements OnInit {

    public servicesDataSource;
    public storagesDataSource;
    public selection = new SelectionModel<Bookables['bookables']['items']>(true, []);

    constructor(private bookableService: BookableService) {
    }

    ngOnInit() {
        const serviceVariables = BookableService.adminApprovedByTag(BookableTagService.SERVICE);
        const qvmServices = new QueryVariablesManager<BookablesVariables>();
        qvmServices.set('variables', serviceVariables);

        // Get all because requirable services should not change
        this.bookableService.getAll(qvmServices).subscribe(result => {
            this.servicesDataSource = new NaturalDataSource(result);
        });

        const storageVariables = BookableService.adminApprovedByTag(BookableTagService.STORAGE);
        const qvmStorage = new QueryVariablesManager<BookablesVariables>();
        qvmStorage.set('variables', storageVariables);

        // Get all because requirable storages should not change
        this.bookableService.getAll(qvmStorage).subscribe(result => {
            this.storagesDataSource = new NaturalDataSource(result);
        });

    }

}
