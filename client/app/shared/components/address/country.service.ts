import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { countriesQuery, countryQuery } from './country.queries';
import { AbstractModelService } from '../../services/abstract-model.service';
import { CountriesQuery, CountriesQueryVariables, CountryQuery, CountryQueryVariables } from '../../generated-types';

@Injectable({
    providedIn: 'root',
})
export class CountryService
    extends AbstractModelService<CountryQuery['country'],
        CountryQueryVariables,
        CountriesQuery['countries'],
        CountriesQueryVariables,
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
