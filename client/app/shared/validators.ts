import { FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Returns a validator that validates that there is never more than 1 value set for all given paths.
 * Typically it should be used on the form itself, not on a control
 */
export function xorValidator(errorKey: string, paths: string[]): ValidatorFn {

    return (control: FormGroup): ValidationErrors | null => {
        const nonEmptyValues = paths.filter(path => control.get(path)?.value);

        if (nonEmptyValues.length > 1) {
            return {[errorKey]: paths}
        }

        return null;
    }
}

/**
 * Error matcher to be used with xorValidator on the form itself
 */
export class XorErrorStateMatcher implements ErrorStateMatcher {
    public constructor(private readonly errorKey: string) {
    }

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        if (!form) {
            return false;
        }

        const formGroup = form.form;

        // this will be a array of paths as defined in xorValidator
        const error: string[] | undefined = formGroup.getError(this.errorKey);
        if (!error) {
            return false;
        }

        // If at least one of our controls is dirty, then show error
        return error.some(path => !!formGroup.get(path)?.dirty);
    }
}
