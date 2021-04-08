import {Apollo, gql} from 'apollo-angular';
import {Component, Input} from '@angular/core';
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
    public bankingInfos?: BankingInfos_bankingInfos;

    constructor(private readonly apollo: Apollo) {}

    @Input() set bankingData(data: BankingInfosVariables) {
        this.apollo
            .query<BankingInfos, BankingInfosVariables>({
                query: q,
                fetchPolicy: 'cache-first',
                variables: data,
            })
            .subscribe(result => (this.bankingInfos = result.data.bankingInfos));
    }
}
