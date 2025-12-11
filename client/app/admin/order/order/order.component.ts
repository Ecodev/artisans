import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {NaturalAlertService, NaturalDialogTriggerProvidedData, NaturalSelectEnumComponent} from '@ecodev/natural';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {
    CurrentUserForProfile,
    Order,
    OrderLinesVariables,
    OrderStatus,
    UserRole,
} from '../../../shared/generated-types';
import {OrderService} from '../services/order.service';
import {MatButton} from '@angular/material/button';
import {OrderLinesComponent} from '../order-lines/order-lines.component';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-order',
    imports: [
        MatDialogModule,
        CurrencyPipe,
        DatePipe,
        NaturalSelectEnumComponent,
        FormsModule,
        OrderLinesComponent,
        MatButton,
    ],
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss',
})
export class OrderComponent {
    protected readonly dialogData = inject<NaturalDialogTriggerProvidedData<never>>(MAT_DIALOG_DATA);
    protected readonly orderService = inject(OrderService);
    private readonly alertService = inject(NaturalAlertService);

    protected forcedVariables: OrderLinesVariables = {};

    /**
     * Preserves usual model that extends AbstractDetail where main object in stored in data.model
     */
    protected data!: {model: Order['order']};

    /**
     * Currently connected user
     */
    protected viewer: CurrentUserForProfile['viewer'] = null;

    /**
     * Template usage
     */
    protected readonly UserRole = UserRole;

    public constructor() {
        this.viewer = this.dialogData.activatedRoute.snapshot.data.viewer
            ? this.dialogData.activatedRoute.snapshot.data.viewer
            : null;

        // Initialize resolved item
        const model$ = this.dialogData.activatedRoute.snapshot.data.model as Observable<Order['order']>;
        model$.pipe(takeUntilDestroyed()).subscribe(order => {
            this.data = {model: order};
            // Filter productLines for this current order
            this.forcedVariables = {
                filter: {groups: [{conditions: [{order: {equal: {value: this.data.model.id}}}]}]},
            };
        });
    }

    protected updateStatus(status: string | string[] | null): void {
        if (typeof status !== 'string') {
            return;
        }

        this.orderService.changeStatus(this.data.model.id, status as OrderStatus).subscribe(() => {
            this.alertService.info('Commande mise à jour');
        });
    }
}
