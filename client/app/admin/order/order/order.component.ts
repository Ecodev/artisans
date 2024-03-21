import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {
    NaturalAlertService,
    NaturalDialogTriggerProvidedData,
    NaturalSelectEnumComponent,
    NaturalSwissDatePipe,
} from '@ecodev/natural';
import {CurrentUserForProfile, OrderLinesVariables, OrderStatus, UserRole} from '../../../shared/generated-types';
import {OrderService} from '../services/order.service';
import {MatButtonModule} from '@angular/material/button';
import {OrderLinesComponent} from '../order-lines/order-lines.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss',
    standalone: true,
    imports: [
        FlexModule,
        MatDialogModule,
        CommonModule,
        NaturalSelectEnumComponent,
        FormsModule,
        OrderLinesComponent,
        MatButtonModule,
        NaturalSwissDatePipe,
    ],
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
    public viewer: CurrentUserForProfile['viewer'] = null;

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
            ? dialogData.activatedRoute.snapshot.data.viewer
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
