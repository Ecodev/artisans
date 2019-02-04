import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ExtendedFormControl } from '../../../shared/classes/ExtendedFormControl';

function passwordValidator(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    if (!value.match(/[a-z]/i) || !value.match(/[^a-z ]/i)) {
        return {
            invalid: 'Le mot de passe doit contenir au moins une lettre et une non-lettre (chiffre ou symbole)',
        };
    }

    return null;
}

function samePasswordsValidator(formGroup: FormGroup): ValidationErrors | null {
    if (!formGroup || !formGroup.controls) {
        return null;
    }

    const password = formGroup.controls.password.value;
    const confirmPassword = formGroup.controls.confirmPassword.value;

    return password === confirmPassword ? null : {notSame: true};
}

class ConfirmPasswordStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

        if (control && control.parent && control.parent instanceof FormGroup) {
            return !!samePasswordsValidator(control.parent) && control.dirty;
        }

        return false;
    }
}

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
    @Input() form: FormGroup;
    public confirmPasswordStateMatcher = new ConfirmPasswordStateMatcher();

    constructor() {

    }

    ngOnInit() {
        this.form.addControl('password', new ExtendedFormControl('', [Validators.required, Validators.minLength(10), passwordValidator]));
        this.form.addControl('confirmPassword', new ExtendedFormControl(''));
        this.form.setValidators(samePasswordsValidator);
    }

}
