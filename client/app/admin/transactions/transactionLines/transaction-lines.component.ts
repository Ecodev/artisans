import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { NaturalAbstractList, NaturalQueryVariablesManager } from '@ecodev/natural';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import {
    Account,
    TransactionLine,
    TransactionLines,
    TransactionLinesForExportVariables,
    TransactionLinesVariables,
    TransactionTag,
} from '../../../shared/generated-types';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { TransactionLineService } from '../services/transaction-line.service';
import { union } from 'lodash';

@Component({
    selector: 'app-transaction-lines',
    templateUrl: './transaction-lines.component.html',
    styleUrls: ['./transaction-lines.component.scss'],
})
export class TransactionLinesComponent extends NaturalAbstractList<TransactionLines['transactionLines'], TransactionLinesVariables>
    implements OnInit {

    @Input() relativeToAccount;
    @Input() hideFab = false;

    @Output() select = new EventEmitter();

    constructor(private transactionLineService: TransactionLineService,
                injector: Injector,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
    ) {

        super(transactionLineService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('transactionLines');

    }

    public download(): void {
        const qvm = new NaturalQueryVariablesManager<TransactionLinesForExportVariables>(this.variablesManager);
        qvm.set('pagination', {pagination: {pageIndex: 0, pageSize: 15000}});

        this.transactionLineService.getExportLink(qvm).subscribe(url => {
            window.location.href = url;
        });
    }

    public filterByAccount(account: Account['account']): void {
        if (this.hideFab) {
            const link = this.transactionLineService.linkToTransactionForAccount(account);
            if (typeof link === 'string') {
                this.router.navigateByUrl(link);
            } else {
                this.router.navigate(link);
            }
        } else {
            const selection = TransactionLineService.getSelectionForAccount(account);
            this.naturalSearchSelections = selection;
            this.search(selection);
        }
    }

    public documentCount(tl: TransactionLine['transactionLine']): number {
        const transaction = tl.transaction;
        const expenseClaim = transaction.expenseClaim;

        return union(
            transaction.accountingDocuments.map((document) => document ? document.id : null),
            expenseClaim ? expenseClaim.accountingDocuments.map((document) => document ? document.id : null) : [],
        ).length;
    }

    public filterByTag(tag: TransactionTag['transactionTag']): void {
        if (this.hideFab) {
            const link = this.transactionLineService.linkToTransactionForTag(tag);
            if (typeof link === 'string') {
                this.router.navigateByUrl(link);
            } else {
                this.router.navigate(link);
            }
        } else {
            const selection = TransactionLineService.getSelectionForTag(tag);
            this.naturalSearchSelections = selection;
            this.search(selection);
        }
    }
}
