import {Component, Inject, Optional} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
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
export class OrderComponent {
    public forcedVariables: OrderLinesVariables;

    /**
     * Preserves usual model that extends AbstractDetail where main object in stored in data.model
     */
    public data;

    /**
     * Currently connected user
     */
    public viewer: CurrentUserForProfile_viewer | null = null;

    /**
     * Template usage
     */
    public UserRole = UserRole;

    public constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public readonly dialogData: NaturalDialogTriggerProvidedData<never>,
        public readonly orderService: OrderService,
        public readonly alertService: NaturalAlertService,
    ) {
        this.viewer = dialogData.activatedRoute.snapshot.data.viewer
            ? dialogData.activatedRoute.snapshot.data.viewer.model
            : null;

        // Initialize resolved item
        this.data = dialogData.activatedRoute.snapshot.data.order;

        // Filter productLines for this current order
        this.forcedVariables = {filter: {groups: [{conditions: [{order: {equal: {value: this.data.model.id}}}]}]}};
    }

    public updateStatus(status: string | string[] | null): void {
        if (typeof status !== 'string') {
            return;
        }

        this.orderService.changeStatus(this.data.model.id, status as OrderStatus).subscribe(() => {
            this.alertService.info('Commande mise à jour');
        });
    }
}
