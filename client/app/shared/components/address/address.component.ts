import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CountryService} from './country.service';
import {NaturalSelectComponent} from '@ecodev/natural';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    standalone: true,
    imports: [FlexModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NaturalSelectComponent],
})
export class AddressComponent {
    /**
     * If fields are editable or not
     */
    @Input()
    public set disabled(value: boolean) {
        ['firstName', 'lastName', 'street', 'postcode', 'locality', 'country'].forEach(name => {
            const control = this.form.get(name);
            if (control) {
                value ? control.disable() : control.enable();
            }
        });
    }

    /**
     * If true, all fields are displayed vertically
     */
    @Input() public vertical = false;

    /**
     * Form group to manage field values
     */
    @Input({required: true}) public form!: FormGroup;

    /**
     * Emits when form changes
     */
    @Output() public readonly addressChange = new EventEmitter<void>();

    public constructor(public readonly countryService: CountryService) {}

    public update(): void {
        this.addressChange.emit();
    }
}
