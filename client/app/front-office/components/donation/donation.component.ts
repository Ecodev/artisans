import {Component, Inject} from '@angular/core';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {CurrencyService} from '../../../shared/services/currency.service';
import {UntypedFormControl, Validators} from '@angular/forms';
import {money} from '@ecodev/natural';

export type DonationData = {
    amount: number | null;
};

@Component({
    selector: 'app-donation',
    templateUrl: './donation.component.html',
    styleUrls: ['./donation.component.scss'],
})
export class DonationComponent {
    public amount = new UntypedFormControl(null, [Validators.required, Validators.min(0), money]);

    public constructor(
        @Inject(MAT_DIALOG_DATA) dialogData: DonationData,
        public readonly currencyService: CurrencyService,
        public readonly dialogRef: MatDialogRef<DonationComponent, number | null>,
    ) {
        this.amount.setValue(dialogData.amount);
    }
}
