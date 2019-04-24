import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
    template: '',
})
export class DialogTriggerComponent implements OnInit {

    constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {

        setTimeout(() => {
            const config = this.route.snapshot.data.dialogConfig;
            config.data = {routeSnapshot: this.route.snapshot};
            this.dialog.open(this.route.snapshot.data.component, config)
                .afterClosed()
                .subscribe((routerLink: RouterLink['routerLink']) => {
                    if (routerLink) {
                        this.router.navigate(routerLink as any[]);
                    } else if (!routerLink && this.route.snapshot.data.escapeRouterLink) {
                        this.router.navigate(this.route.snapshot.data.escapeRouterLink);
                    }
                });
        });
    }

}
