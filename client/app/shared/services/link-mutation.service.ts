import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MutationsQuery } from '../generated-types';
import { FetchResult } from 'apollo-link';
import { Literal } from '../types';
import { Utility } from '../classes/utility';
import { clone } from 'lodash';
import { AbstractModelService } from './abstract-model.service';

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
    private queriesQuery = gql`query Mutations {
        __type(name: "Mutation") {
            fields {
                name
            }
        }
    }`;

    /**
     * Receives the list of available mutation names
     */
    private mutationNames;

    constructor(private apollo: Apollo) {
        this.apollo.query<MutationsQuery>({
            query: this.queriesQuery,
            fetchPolicy: 'cache-first',
        }).subscribe(({data}) => {
            this.mutationNames = data.__type ? data.__type.fields : null;
        });
    }

    /**
     * Link two objects together
     */
    public link(obj1: LinkableObject, obj2: LinkableObject, variables: Literal = {}): Observable<FetchResult<{ id: string }>> {
        const mutation = this.getMutation('link', obj1, obj2, clone(variables)); // clone prevents to affect the original reference

        return this.execute(mutation);
    }

    /**
     * Link many objects
     */
    public linkMany(obj1: LinkableObject, objSet: LinkableObject[], variables: Literal = {}): Observable<FetchResult<{ id: string }>[]> {

        const observables: Observable<FetchResult<{ id: string }>[]>[] = [];

        objSet.forEach(obj2 => {
            observables.push(this.link(obj1, obj2, variables));
        });

        return forkJoin(observables);
    }

    /**
     * Unlink two objects
     */
    public unlink(obj1: LinkableObject, obj2: LinkableObject): Observable<FetchResult<{ id: string }>> {
        const mutation = this.getMutation('unlink', obj1, obj2);

        return this.execute(mutation);
    }

    /**
     * Generate mutation using patters and replacing variables
     */
    private getMutation(action: string, obj1, obj2, variables: Literal = {}, tryReverse = true): string {
        const mutationName = `${action}${obj1.__typename}${obj2.__typename}`;

        if (this.mutationNames.find(mut => mut.name === mutationName)) {
            return this.buildTemplate(mutationName, obj1, obj2, variables);
        }

        const result = tryReverse ? this.getMutation(action, obj2, obj1, variables, false) : null;
        if (!result) {
            throw TypeError('API does not allow to ' + action + ' ' + obj1.__typename + ' and ' + obj2.__typename);

        }

        return result;
    }

    /**
     * Execute mutation
     */
    private execute(mutation: string): Observable<FetchResult<{ id: string }>> {
        return this.apollo.mutate({
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
            name1 = 'source' + obj1.__typename;
            name2 = 'target' + obj2.__typename;
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
