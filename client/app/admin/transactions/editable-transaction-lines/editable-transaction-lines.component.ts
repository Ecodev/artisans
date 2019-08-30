import { Component, Input, OnInit } from '@angular/core';
import { TransactionLineService } from '../services/transaction-line.service';
import {
    Account,
    Transaction,
    TransactionLineInput,
    TransactionLines_transactionLines_items,
    TransactionLinesVariables,
} from '../../../shared/generated-types';
import { TransactionTagService } from '../../transactionTags/services/transactionTag.service';
import { NaturalAbstractEditableList } from '@ecodev/natural';
import { accountHierarchicConfiguration } from '../../../shared/hierarchic-selector/AccountHierarchicConfiguration';

@Component({
    selector: 'app-editable-transaction-lines',
    templateUrl: './editable-transaction-lines.component.html',
    styleUrls: ['./editable-transaction-lines.component.scss'],
})
export class EditableTransactionLinesComponent
    extends NaturalAbstractEditableList<TransactionLines_transactionLines_items | TransactionLineInput, TransactionLinesVariables>
    implements OnInit {

    @Input() transaction: Transaction['transaction'];

    public accountHierarchicConfig = accountHierarchicConfiguration;
    public columns = ['name', 'balance', 'debit', 'credit', 'transactionTag', 'remarks', 'isReconciled',  'remove'];

    constructor(
        private transactionLineService: TransactionLineService,
        public transactionTagService: TransactionTagService,
    ) {
        super(transactionLineService);
    }

    ngOnInit() {

        if (this.transaction && this.transaction.id) {

            this.variablesManager.set('variables', {
                filter: {groups: [{conditions: [{transaction: {equal: {value: this.transaction.id}}}]}]},
            });

            // TODO : Replace getAll by watchAll
            this.service.getAll(this.variablesManager).subscribe(results => {
                this.setItems(results.items);
            });
        } else {
            this.addEmpty();
        }
    }

    public getAccountLabel(account: Account['account']): string {
        return [account.code, account.name].join(' ');
    }

}
