import { Component, Input, OnInit } from '@angular/core';
import { AbstractEditableList } from '../../shared/components/AbstractEditableList';
import { TransactionLineService } from '../services/transactionLine.service';
import { AccountConfiguration } from '../../../shared/hierarchic-selector/configurations/AccountConfiguration';
import { BookableService } from '../../bookables/services/bookable.service';
import { Transaction, TransactionLinesVariables } from '../../../shared/generated-types';
import { TransactionTagService } from '../../transactionTags/services/transactionTag.service';

@Component({
    selector: 'app-editable-transaction-lines',
    templateUrl: './editable-transaction-lines.component.html',
    styleUrls: ['./editable-transaction-lines.component.scss'],
})
export class EditableTransactionLinesComponent extends AbstractEditableList<any, any> implements OnInit {

    @Input() transaction: Transaction['transaction'];

    public accountHierarchicConfig = AccountConfiguration;
    public columns = ['name', 'balance', 'debit', 'credit', 'bookable', 'transactionTag', 'remove'];

    constructor(private transactionLineService: TransactionLineService,
                public transactionTagService: TransactionTagService,
                public bookableService: BookableService) {
        super('transactionLine', transactionLineService);
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.transaction && this.transaction.id) {

            this.variablesManager.set('variables', {
                filter: {groups: [{conditions: [{transaction: {equal: {value: this.transaction.id}}}]}]},
            } as TransactionLinesVariables);

            // TODO : Replace getAll by watchAll
            this.service.getAll(this.variablesManager, true).subscribe(results => {
                this.add(results);
            });
        } else {
            this.addEmpty();
        }
    }

}
