import {Apollo, onlyCompleteData} from 'apollo-angular';
import {NetworkStatus} from '@apollo/client';
import {inject, Injectable} from '@angular/core';
import {type Observable, Subject} from 'rxjs';
import {
    type ConfigurationQuery,
    type ConfigurationQueryVariables,
    type UpdateConfiguration,
    type UpdateConfigurationVariables,
} from '../../shared/generated-types';
import {configurationQuery, updateConfiguration} from './configuration.queries';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    private readonly apollo = inject(Apollo);

    public get(key: string): Observable<string> {
        const resultObservable = new Subject<string>();

        const queryRef = this.apollo.watchQuery<ConfigurationQuery, ConfigurationQueryVariables>({
            query: configurationQuery,
            variables: {key},
            fetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: false,
        });

        const subscription = queryRef.valueChanges.pipe(onlyCompleteData()).subscribe(result => {
            const data = result.data.configuration;
            resultObservable.next(data);
            if (result.networkStatus === NetworkStatus.ready) {
                resultObservable.complete();
                subscription.unsubscribe();
            }
        });

        return resultObservable.asObservable();
    }

    public set(key: string, value: string): void {
        this.apollo
            .mutate<UpdateConfiguration, UpdateConfigurationVariables>({
                mutation: updateConfiguration,
                variables: {key, value},
            })
            .subscribe();
    }
}
