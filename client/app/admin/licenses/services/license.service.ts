import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { createLicense, deleteLicenses, licenseQuery, licensesQuery, updateLicense } from './license.queries';
import {
    CreateLicense,
    CreateLicenseVariables,
    LicenseInput,
    License,
    LicenseVariables,
    Licenses,
    LicensesVariables,
    UpdateLicense,
    UpdateLicenseVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class LicenseService extends AbstractModelService<License['license'],
    LicenseVariables,
    Licenses['licenses'],
    LicensesVariables,
    CreateLicense['createLicense'],
    CreateLicenseVariables,
    UpdateLicense['updateLicense'],
    UpdateLicenseVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo, 'license', licenseQuery, licensesQuery, createLicense, updateLicense, deleteLicenses);
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
