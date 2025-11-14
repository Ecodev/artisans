import {NaturalErrorMessagePipe} from '@ecodev/natural';
import {Component, inject, Input, input, output} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CountryService} from './country.service';
import {NaturalSelectComponent} from '@ecodev/natural';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';

@Component({
    selector: 'app-address',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatError,
        NaturalErrorMessagePipe,
        MatInput,
        NaturalSelectComponent,
    ],
    templateUrl: './address.component.html',
    styleUrl: './address.component.scss',
})
export class AddressComponent {
    public readonly countryService = inject(CountryService);

    /**
     * If fields are editable or not
     */
    @Input()
    public set disabled(value: boolean) {
        ['firstName', 'lastName', 'street', 'postcode', 'locality', 'country'].forEach(name => {
            const control = this.form().get(name);
            if (control) {
                value ? control.disable() : control.enable();
            }
        });
    }

    /**
     * Form group to manage field values
     */
    public readonly form = input.required<FormGroup>();

    /**
     * Emits when form changes
     */
    public readonly addressChange = output();

    protected update(): void {
        this.addressChange.emit();
    }
}
