import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NaturalAlertService, NaturalDialogTriggerProvidedData} from '@ecodev/natural';
import {
    CurrentUserForProfile_viewer,
    OrderLinesVariables,
    OrderStatus,
    UserRole,
} from '../../../shared/generated-types';
import {OrderService} from '../services/order.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
    public contextVariables: OrderLinesVariables;

    /**
     * Preserves usual model that extends AbstractDetail where main object in stored in data.model
     */
    public data;

    /**
     * Currently connected user
     */
    public viewer: CurrentUserForProfile_viewer | null;

    /**
     * Template usage
     */
    public UserRole = UserRole;

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: NaturalDialogTriggerProvidedData,
        public orderService: OrderService,
        public alertService: NaturalAlertService,
    ) {
        this.viewer = dialogData.activatedRoute.snapshot.data.viewer
            ? dialogData.activatedRoute.snapshot.data.viewer.model
            : null;

        // Initialize resolved item
        this.data = dialogData.activatedRoute.snapshot.data.order;

        // Filter productLines for this current order
        this.contextVariables = {filter: {groups: [{conditions: [{order: {equal: {value: this.data.model.id}}}]}]}};
    }

    public ngOnInit(): void {}

    public updateStatus(status: OrderStatus) {
        this.orderService.changeStatus(this.data.model.id, status).subscribe(result => {
            this.alertService.info('Commande mise à jour');
        });
    }
}
