import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { MutationsQuery } from '../generated-types';
import { FetchResult } from 'apollo-link';
import { Literal } from '../types';
import { Utility } from '../classes/utility';
import { clone } from 'lodash';
import { AbstractModelService } from './abstract-model.service';
import { map, switchMap } from 'rxjs/operators';

export interface LinkableObject {
    id: string;
    __typename: string;
}

@Injectable({
    providedIn: 'root',
})
export class LinkMutationService {

    /**
     * Query to get list of mutations
     */
    private queriesQuery = gql`
        query Mutations {
            __type(name: "Mutation") {
                fields {
                    name
                }
            }
        }`;
    /**
     * Receives the list of available mutation names
     */
    private allMutationNames: string[] | null;

    constructor(private apollo: Apollo) {
    }

    /**
     * Return the list of all available mutation names
     */
    private getAllMutationNames(): Observable<string[]> {
        if (this.allMutationNames) {
            return of(this.allMutationNames);
        }

        return this.apollo.query<MutationsQuery>({
            query: this.queriesQuery,
            fetchPolicy: 'cache-first',
        }).pipe(map(({data}) => {
            this.allMutationNames = data.__type && data.__type.fields ? data.__type.fields.map(v => v.name) : [];

            return this.allMutationNames;
        }));
    }

    /**
     * Link two objects together
     */
    public link(obj1: LinkableObject, obj2: LinkableObject, variables: Literal = {}): Observable<FetchResult<{ id: string }>> {
        // clone prevents to affect the original reference
        const clonedVariables = clone(variables);

        return this.getMutation('link', obj1, obj2, clonedVariables).pipe(switchMap(mutation => this.execute(mutation)));
    }

    /**
     * Link many objects
     */
    public linkMany(obj1: LinkableObject, objSet: LinkableObject[], variables: Literal = {}): Observable<FetchResult<{ id: string }>[]> {

        const observables: Observable<FetchResult<{ id: string }>>[] = [];

        objSet.forEach(obj2 => {
            observables.push(this.link(obj1, obj2, variables));
        });

        return forkJoin(observables);
    }

    /**
     * Unlink two objects
     */
    public unlink(obj1: LinkableObject, obj2: LinkableObject): Observable<FetchResult<{ id: string }>> {
        return this.getMutation('unlink', obj1, obj2).pipe(switchMap(mutation => this.execute(mutation)));
    }

    /**
     * Generate mutation using patters and replacing variables
     */
    private getMutation(action: string, obj1, obj2, variables: Literal = {}): Observable<string> {
        const mutationName = `${action}${obj1.__typename}${obj2.__typename}`;
        const reversedMutationName = `${action}${obj2.__typename}${obj1.__typename}`;

        return this.getAllMutationNames().pipe(map(allMutationNames => {

                if (allMutationNames.find(mut => mut === mutationName)) {
                    return this.buildTemplate(mutationName, obj1, obj2, variables);
                } else if (allMutationNames.find(mut => mut === reversedMutationName)) {
                    return this.buildTemplate(reversedMutationName, obj2, obj1, variables);
                }

                throw TypeError('API does not allow to ' + action + ' ' + obj1.__typename + ' and ' + obj2.__typename);
            },
        ));
    }

    /**
     * Execute mutation
     */
    private execute(mutation: string): Observable<FetchResult<{ id: string }>> {
        return this.apollo.mutate<{ id: string }>({
            mutation: gql(mutation),
            refetchQueries: AbstractModelService.getRefetchQueries(),
        });
    }

    /**
     * Build the actual mutation string
     */
    private buildTemplate(mutationName: string, obj1, obj2, variables: Literal = {}): string {
        let name1;
        let name2;
        if (obj1.__typename === obj2.__typename) {
            name1 = Utility.lowerCaseFirstLetter(obj1.__typename) + '1';
            name2 = Utility.lowerCaseFirstLetter(obj1.__typename) + '2';
        } else {
            name1 = Utility.lowerCaseFirstLetter(obj1.__typename);
            name2 = Utility.lowerCaseFirstLetter(obj2.__typename);
        }
        variables[name1] = obj1.id;
        variables[name2] = obj2.id;

        let serializedVariables = '';
        for (const key of Object.keys(variables)) {
            serializedVariables += key + ': ' + JSON.stringify(variables[key]) + ' ';
        }

        return `mutation linkAndUnlink {
        ${mutationName}(${serializedVariables}) {
            id
        }
    }`;
    }

}
