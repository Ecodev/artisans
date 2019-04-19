import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { countriesQuery, countryQuery } from './country.queries';
import { Countries, CountriesVariables, Country, CountryVariables } from '../../generated-types';
import { NaturalAbstractModelService } from '../../../natural/services/abstract-model.service';

@Injectable({
    providedIn: 'root',
})
export class CountryService
    extends NaturalAbstractModelService<Country['country'],
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
