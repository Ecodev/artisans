import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CountryService } from './country.service';

export const markFormGroupTouched = (formGroup) => {

    (Object as any).values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control.controls) {
            markFormGroupTouched(control);
        }
    });
};

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
    @Input() vertical = false;

    /**
     * Form group to manage field values
     */
    @Input() form: FormGroup;

    /**
     * Emits when form changes
     */
    @Output() change: EventEmitter<void> = new EventEmitter<void>();

    constructor(public countryService: CountryService) {
    }

    public update() {
        this.change.emit();
    }

}
