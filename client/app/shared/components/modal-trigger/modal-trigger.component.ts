import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    template: '',
})
export class ModalTriggerComponent implements OnInit {

    constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {

        setTimeout(() => {
            const config = this.route.snapshot.data.dialogConfig;
            config.data = {routeSnapshot: this.route.snapshot};
            this.dialog.open(this.route.snapshot.data.component, config).backdropClick().subscribe(() => {
                if (this.route.snapshot.data.backdropRedirection) {
                    this.router.navigateByUrl(this.route.snapshot.data.backdropRedirection);
                }
            });
        });
    }

}
