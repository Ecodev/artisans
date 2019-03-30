import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { countriesQuery, countryQuery } from './country.queries';
import { AbstractModelService } from '../../services/abstract-model.service';
import { Countries, CountriesVariables, Country, CountryVariables } from '../../generated-types';

@Injectable({
    providedIn: 'root',
})
export class CountryService
    extends AbstractModelService<Country['country'],
        CountryVariables,
        Countries['countries'],
        CountriesVariables,
        null,
        { input: {} },
        null,
        { id: string, input: {} },
        null> {

    constructor(apollo: Apollo) {
        super(apollo,
            'country',
            countryQuery,
            countriesQuery,
            null,
            null,
            null);
    }

}
