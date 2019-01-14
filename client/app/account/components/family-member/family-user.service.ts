import { Injectable } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Literal } from '../../../shared/types';
import { FormValidators } from '../../../shared/services/abstract-model.service';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { ErrorStateMatcher } from '@angular/material';
import { BookingService } from '../../../admin/bookings/services/booking.service';

export class ConfirmPasswordStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

        if (control && control.parent && control.parent instanceof FormGroup) {
            return !!UserService.checkPassword(control.parent) && control.dirty;
        }

        return false;
    }
}

@Injectable({
    providedIn: 'root',
})
export class FamilyUserService extends UserService {

    constructor(apollo: Apollo, router: Router, bookingService: BookingService) {
        super(apollo, router, bookingService);
    }

    public getDefaultValues(): Literal {
        const values = {
            confirmPassword: '',
            hasInsurance: false,
            termsAgreement: false,
        };

        return Object.assign(super.getDefaultValues(), values);
    }

    public getFormValidators(): FormValidators {

        const validators = {
            password: [Validators.minLength(9)],
            confirmPassword: [],
            hasInsurance: [],
            termsAgreement: [],
            locality: [],
            street: [],
            postcode: [],
            country: [],
        };

        return Object.assign(super.getFormValidators(), validators);
    }

    public getFormGroupValidators(): ValidatorFn[] {
        return [UserService.checkPassword];
    }
}
