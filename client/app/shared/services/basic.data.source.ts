/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */

import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

export class BasicDataSource<T = any> extends DataSource<T> {

    private readonly _data: BehaviorSubject<T[] | null>;

    /** Array of data that should be rendered by the table, where each object represents one row. */
    get data(): T[] | null {
        return this._data.value;
    }

    set data(data: T[] | null) {
        this._data.next(data);
    }

    constructor(data: Observable<T[] | null> | T[] | null) {
        super();

        if (data instanceof Observable) {
            this._data = new BehaviorSubject<T[] | null>(null);
            data.subscribe(res => this.data = res);
        } else {
            this._data = new BehaviorSubject<T[] | null>(data);
        }
    }

    connect(): BehaviorSubject<T[]> {
        return this._data as BehaviorSubject<T[]>;
    }

    disconnect() {
        // this._data.unsubscribe(); // cause error, search what should be done here.
    }

    public push(item) {
        const fullList = this.data === null ? [] : this.data;
        fullList.push(item);
        this.data = fullList;
    }

    public pop() {
        const fullList = this.data === null ? [] : this.data;
        const removedElement = fullList.pop();
        this.data = fullList;
        return removedElement;
    }

}
