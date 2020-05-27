import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BankingInfosVariables} from '../../../shared/generated-types';

@Component({
    selector: 'app-provision',
    templateUrl: './provision.component.html',
    styleUrls: ['./provision.component.scss'],
})
export class ProvisionComponent implements OnInit {
    public bvrData: BankingInfosVariables;

    constructor(@Inject(MAT_DIALOG_DATA) public data: BankingInfosVariables) {
        this.bvrData = this.data;
    }

    public ngOnInit(): void {}
}
