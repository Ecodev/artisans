import { AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs';

export class ExtendedFormControl extends FormControl {
    public touchedChanges: Subject<boolean> = new Subject<boolean>();
    public dirtyChanges: Subject<boolean> = new Subject<boolean>();

    constructor(formState: Object,
                validator: ValidatorFn | ValidatorFn[] | null = null,
                asyncValidator: AsyncValidatorFn | AsyncValidatorFn[] | null = null) {

        super(formState, validator, asyncValidator);
    }

    markAsTouched({onlySelf}: { onlySelf?: boolean } = {}): void {
        super.markAsTouched({onlySelf});
        this.touchedChanges.next(true);
    }

    markAsDirty({onlySelf}: { onlySelf?: boolean } = {}): void {
        super.markAsDirty({onlySelf});
        this.dirtyChanges.next(true);
    }

}
