import {Component, Input} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {BankingInfos, BankingInfos_bankingInfos, BankingInfosVariables} from '../../../../../shared/generated-types';

const q = gql`
    query BankingInfos($user: UserID!, $amount: CHF) {
        bankingInfos(user: $user, amount: $amount) {
            referenceNumber
            encodingLine
            postAccount
            paymentTo
            paymentFor
        }
    }
`;

@Component({
    selector: 'app-bvr',
    templateUrl: './bvr.component.html',
    styleUrls: ['./bvr.component.scss'],
})
export class BvrComponent {
    public bankingInfos: BankingInfos_bankingInfos;

    constructor(private apollo: Apollo) {}

    @Input() set bankingData(data: BankingInfosVariables) {
        console.log('bankingData', data);
        this.apollo
            .query<BankingInfos, BankingInfosVariables>({
                query: q,
                fetchPolicy: 'cache-first',
                variables: data,
            })
            .subscribe(result => (this.bankingInfos = result.data.bankingInfos));
    }
}
