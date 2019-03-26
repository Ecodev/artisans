import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-provision',
    templateUrl: './provision.component.html',
    styleUrls: ['./provision.component.scss'],
})
export class ProvisionComponent implements OnInit {

    public amount = 10;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

}
