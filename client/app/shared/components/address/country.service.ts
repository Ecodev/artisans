import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {Countries, CountriesVariables, Country, CountryVariables} from '../../generated-types';
import {countriesQuery, countryQuery} from './country.queries';

@Injectable({
    providedIn: 'root',
})
export class CountryService extends NaturalAbstractModelService<
    Country['country'],
    CountryVariables,
    Countries['countries'],
    CountriesVariables,
    null,
    never,
    null,
    never,
    null,
    never
> {
    public constructor(apollo: Apollo) {
        super(apollo, 'country', countryQuery, countriesQuery, null, null, null);
    }
}
