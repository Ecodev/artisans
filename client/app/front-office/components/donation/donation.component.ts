import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CurrencyService} from '../../../shared/services/currency.service';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {money} from '@ecodev/natural';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export type DonationData = {
    amount: number | null;
};

@Component({
    selector: 'app-donation',
    templateUrl: './donation.component.html',
    styleUrls: ['./donation.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatButtonModule,
    ],
})
export class DonationComponent {
    public amount = new FormControl<number | null>(null, [Validators.required, Validators.min(0), money]);

    public constructor(
        @Inject(MAT_DIALOG_DATA) dialogData: DonationData,
        public readonly currencyService: CurrencyService,
        public readonly dialogRef: MatDialogRef<DonationComponent, number | null>,
    ) {
        this.amount.setValue(dialogData.amount);
    }
}
