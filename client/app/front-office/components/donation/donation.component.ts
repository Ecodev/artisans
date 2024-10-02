import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CurrencyService} from '../../../shared/services/currency.service';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {money} from '@ecodev/natural';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export type DonationData = {
    amount: number | null;
};

@Component({
    selector: 'app-donation',
    templateUrl: './donation.component.html',
    styleUrl: './donation.component.scss',
    standalone: true,
    imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule],
})
export class DonationComponent {
    public readonly currencyService = inject(CurrencyService);
    public readonly dialogRef = inject<MatDialogRef<DonationComponent, number | null>>(MatDialogRef);

    public amount = new FormControl<number | null>(null, [Validators.required, Validators.min(0), money]);

    public constructor() {
        const dialogData = inject<DonationData>(MAT_DIALOG_DATA);

        this.amount.setValue(dialogData.amount);
    }
}
