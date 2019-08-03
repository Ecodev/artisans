import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractList, NaturalAlertService, NaturalPersistenceService, NaturalQueryVariablesManager } from '@ecodev/natural';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { TransactionLines, TransactionLinesVariables, Account } from '../../../shared/generated-types';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { TransactionLineService } from '../services/transaction-line.service';

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

    constructor(route: ActivatedRoute,
                router: Router,
                private transactionLineService: TransactionLineService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
    ) {

        super(transactionLineService,
            router,
            route,
            alertService,
            persistenceService,
        );

        this.naturalSearchFacets = naturalSearchFacetsService.get('transactionLines');

    }

    public download(): void {
        const qvm = new NaturalQueryVariablesManager(this.variablesManager);
        qvm.set('pagination', {pagination: {pageIndex: 0, pageSize: 9999}});

        this.transactionLineService.getExportLink(qvm).subscribe(url => {
            window.location.href = url;
        });
    }

    public searchAccount(account: Account['account']) {
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
}
