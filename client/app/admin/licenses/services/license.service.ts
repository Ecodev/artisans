import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { createLicenseMutation, deleteLicensesMutation, licenseQuery, licensesQuery, updateLicenseMutation } from './license.queries';
import {
    CreateLicenseMutation,
    CreateLicenseMutationVariables,
    LicenseInput,
    LicenseQuery,
    LicenseQueryVariables,
    LicensesQuery,
    LicensesQueryVariables,
    UpdateLicenseMutation,
    UpdateLicenseMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class LicenseService extends AbstractModelService<LicenseQuery['license'],
    LicenseQueryVariables,
    LicensesQuery['licenses'],
    LicensesQueryVariables,
    CreateLicenseMutation['createLicense'],
    CreateLicenseMutationVariables,
    UpdateLicenseMutation['updateLicense'],
    UpdateLicenseMutationVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo, 'license', licenseQuery, licensesQuery, createLicenseMutation, updateLicenseMutation, deleteLicensesMutation);
    }

    public getEmptyObject(): LicenseInput {
        return {
            name: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}
