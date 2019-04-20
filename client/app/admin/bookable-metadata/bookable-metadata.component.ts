import { Component, Input, OnInit } from '@angular/core';
import { BookableMetadataService } from './bookable-metadata.service';
import { NaturalDataSource } from '@ecodev/natural';
import { BookableMetadatasVariables } from '../../shared/generated-types';
import { NaturalQueryVariablesManager } from '@ecodev/natural';

@Component({
    selector: 'app-bookable-metadata',
    templateUrl: './bookable-metadata.component.html',
    styleUrls: ['./bookable-metadata.component.scss'],
})
export class BookableMetadataComponent implements OnInit {

    @Input() bookable;
    @Input() edit = false;

    public dataSource: NaturalDataSource;

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
            const variables: BookableMetadatasVariables = {
                filter: {groups: [{conditions: [{bookable: {equal: {value: this.bookable.id}}}]}]},
            };

            const qvm = new NaturalQueryVariablesManager<BookableMetadatasVariables>();
            qvm.set('variables', variables);

            // TODO : replace by watchAll because two admins may work on same object and meta data could change between two visits
            this.bookableMetaService.getAll(qvm).subscribe(bookables => {
                this.dataSource = new NaturalDataSource(bookables);
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
                this.dataSource.push(this.bookableMetaService.getConsolidatedForClient());
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
