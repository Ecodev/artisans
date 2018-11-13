/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */

import { Observable } from 'rxjs';
import { BasicDataSource } from './basic.data.source';
import { filter, map } from 'rxjs/operators';
import { QueryVariablesManager } from '../classes/query-variables-manager';

export class PaginatedDataSource extends BasicDataSource<any> {

    public length = null;

    constructor(data: Observable<any>, private variablesManager: QueryVariablesManager) {
        super(data.pipe(filter(v => v && v.items), map(v => v.items)));
        data.subscribe(result => this.length = result ? result.length : undefined);
    }

    get pagination() {
        return this.variablesManager.variables.value ? this.variablesManager.variables.value.pagination : null;
    }

}
