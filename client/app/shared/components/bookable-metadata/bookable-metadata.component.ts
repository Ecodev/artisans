import { Component, Input, OnInit } from '@angular/core';
import { AppDataSource } from '../../services/data.source';
import { BookableMetadataService } from './bookable-metadata.service';
import { QueryVariablesManager } from '../../classes/query-variables-manager';
import { BookableMetadatasQueryVariables } from '../../generated-types';

@Component({
    selector: 'app-bookable-metadata',
    templateUrl: './bookable-metadata.component.html',
    styleUrls: ['./bookable-metadata.component.scss'],
})
export class BookableMetadataComponent implements OnInit {

    @Input() bookable;
    @Input() edit = false;

    public dataSource: AppDataSource;

    public columns;

    constructor(private bookableMetaService: BookableMetadataService) {
    }

    ngOnInit() {

        if (this.edit) {
            this.columns = ['name', 'value', 'delete'];
        } else {
            this.columns = ['name', 'value'];
        }

        if (this.bookable) {
            const variables: BookableMetadatasQueryVariables = {
                filter: {groups: [{conditions: [{bookable: {equal: {value: this.bookable.id}}}]}]},
            };

            const qvm = new QueryVariablesManager<BookableMetadatasQueryVariables>();
            qvm.set('variables', variables);

            this.bookableMetaService.getAll(qvm).subscribe(bookables => {
                this.dataSource = new AppDataSource(bookables);
                this.addLine();
            });
        } else {
            this.addLine();
        }

    }

    /**
     * Add line if edit mode is true and last item is not already empty
     */
    public addLine() {
        if (this.edit) {
            const nbItems = this.dataSource.data.items.length;
            const lastItem = nbItems > 0 ? this.dataSource.data.items[nbItems - 1] : 0;
            if (lastItem.name !== '' || lastItem.value !== '') {
                this.dataSource.push(this.bookableMetaService.getEmptyObject());
            }
        }
    }

    public updateOrCreate(meta) {

        meta.bookable = this.bookable.id;

        if (meta.name) {
            this.bookableMetaService.createOrUpdate(meta).subscribe(() => {
            });

            this.addLine();

        } else if (meta.name === '' && meta.value === '' && meta.id) {
            // If has ID and empty attributes, remove it
            this.delete(meta);
        }

    }

    public delete(meta) {
        this.bookableMetaService.delete([meta]).subscribe(() => {
            this.dataSource.remove(meta);
        });
    }

}
