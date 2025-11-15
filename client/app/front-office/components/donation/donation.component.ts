import {NaturalErrorMessagePipe} from '@ecodev/natural';
import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CurrencyService} from '../../../shared/services/currency.service';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {money} from '@ecodev/natural';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';

export type DonationData = {
    amount: number | null;
};

@Component({
    selector: 'app-donation',
    imports: [
        MatDialogModule,
        MatFormField,
        MatLabel,
        MatError,
        NaturalErrorMessagePipe,
        MatSuffix,
        MatInput,
        FormsModule,
        ReactiveFormsModule,
        MatButton,
    ],
    templateUrl: './donation.component.html',
    styleUrl: './donation.component.scss',
})
export class DonationComponent {
    protected readonly currencyService = inject(CurrencyService);
    protected readonly dialogRef = inject<MatDialogRef<DonationComponent, number | null>>(MatDialogRef);

    protected amount = new FormControl<number | null>(null, [Validators.required, Validators.min(0), money]);

    public constructor() {
        const dialogData = inject<DonationData>(MAT_DIALOG_DATA);

        this.amount.setValue(dialogData.amount);
    }
}
