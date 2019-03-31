import { Component, OnInit } from '@angular/core';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { QueryVariablesManager } from '../../classes/query-variables-manager';
import { AppDataSource } from '../../services/data.source';
import { Bookables, BookablesVariables } from '../../generated-types';
import { SelectionModel } from '@angular/cdk/collections';

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
        const serviceVariables = BookableService.adminApprovedByTag('6007');
        const qvmServices = new QueryVariablesManager<BookablesVariables>();
        qvmServices.set('variables', serviceVariables);

        // Get all because requirable services should not change
        this.bookableService.getAll(qvmServices).subscribe(result => {
            this.servicesDataSource = new AppDataSource(result);
        });

        const storageVariables = BookableService.adminApprovedByTag('6008');
        const qvmStorage = new QueryVariablesManager<BookablesVariables>();
        qvmStorage.set('variables', storageVariables);

        // Get all because requirable storages should not change
        this.bookableService.getAll(qvmStorage).subscribe(result => {
            this.storagesDataSource = new AppDataSource(result);
        });

    }

}
