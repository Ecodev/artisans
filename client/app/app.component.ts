import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CountriesQuery } from './shared/generated-types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'my-ichtus';

    public data: CountriesQuery | null;

    constructor(private apollo: Apollo) {
    }

    public fetch(): void {
        const query = gql`
            query Countries {
                countries {
                    items {
                        code
                        name
                    }
                }
            }
        `;

        this.apollo.query<CountriesQuery>({
            query: query,

        }).subscribe(result => this.data = result.data);
    }
}
