import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {CountryService} from './country.service';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
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
    @Input() public form!: UntypedFormGroup;

    /**
     * Emits when form changes
     */
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() public readonly change = new EventEmitter<void>();

    public constructor(public readonly countryService: CountryService) {}

    public update(): void {
        this.change.emit();
    }
}
