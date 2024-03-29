import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';

@Injectable({
    providedIn: 'root',
})
export class LocalizedPaginatorIntlService extends MatPaginatorIntl {
    public constructor() {
        super();

        this.itemsPerPageLabel = 'Par page :';
        this.itemsPerPageLabel = this.itemsPerPageLabel.replace(':', '').trim();
        this.nextPageLabel = 'Suivant';
        this.previousPageLabel = 'Précédent';

        this.getRangeLabel = (page: number, pageSize: number, length: number): string => {
            if (length === 0 || pageSize === 0) {
                return `0/${length}`;
            }

            length = Math.max(length, 0);

            const startIndex = page * pageSize;

            // If the start index exceeds the list length, do not try and fix the end index to the end.
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

            return `${startIndex + 1}-${endIndex}/${length}`;
        };
    }
}
