import { Component, EventEmitter, Input, Output } from '@angular/core';
import { merge } from 'lodash';
import { CountryService } from './country.service';
import { FormGroup } from '@angular/forms';

export const markFormGroupTouched = (formGroup) => {

    (<any>Object).values(formGroup.controls).forEach(control => {
        console.log(control.controls);
        control.markAsTouched();
        if (control.controls) {
            console.log('a');
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

    @Input() vertical = false;
    @Input() form: FormGroup;
    @Output() change: EventEmitter<boolean> = new EventEmitter();

    constructor(public countryService: CountryService) {
    }

    public update() {
        this.change.emit(true);
    }

}
