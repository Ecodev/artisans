import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnumType } from '../../shared/generated-types';
import { enumTypeQuery } from '../../shared/queries/enum';

export interface IEnum {
    value: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class NaturalEnumService {

    constructor(private apollo: Apollo) {
    }

    /**
     * Return a list of observable enumerables considering the given name
     */
    public get(name: string): Observable<IEnum[]> {

        // Load possible action statuses
        return this.apollo.query<EnumType>({
            query: enumTypeQuery,
            variables: {name: name},
            fetchPolicy: 'cache-first',
        }).pipe(map(result => {
            const values: IEnum[] = [];
            if (result.data.__type && result.data.__type.enumValues) {
                for (const enumValue of result.data.__type.enumValues) {
                    values.push({
                        value: enumValue.name,
                        name: enumValue.description || '',
                    });
                }
            }
            return values;
        }));
    }

}
