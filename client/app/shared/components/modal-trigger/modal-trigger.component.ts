import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
    template: '',
})
export class ModalTriggerComponent implements OnInit {

    constructor(private dialog: MatDialog, private route: ActivatedRoute) {
    }

    ngOnInit() {

        setTimeout(() => {
            const data = this.route.snapshot.data;
            data.data = this.route.snapshot.data;
            this.dialog.open(data.component, data);
        });
    }

}
