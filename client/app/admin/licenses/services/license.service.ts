import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { licensesQuery } from './license.queries';
import { LicensesQuery, LicensesQueryVariables } from '../../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class LicenseService extends AbstractModelService<
    any,
    any,
    LicensesQuery['licenses'],
    LicensesQueryVariables,
    any,
    any,
    any,
    any,
    any> {

    constructor(apollo: Apollo) {
        super(apollo, 'license', null, licensesQuery, null, null, null);
    }

}
