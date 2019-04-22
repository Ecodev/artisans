import { Component, Input, OnInit } from '@angular/core';
import { ProductMetadataService } from './product-metadata.service';
import { NaturalDataSource } from '@ecodev/natural';
import { ProductMetadatasVariables } from '../../shared/generated-types';
import { NaturalQueryVariablesManager } from '@ecodev/natural';

@Component({
    selector: 'app-product-metadata',
    templateUrl: './product-metadata.component.html',
    styleUrls: ['./product-metadata.component.scss'],
})
export class ProductMetadataComponent implements OnInit {

    @Input() product;
    @Input() edit = false;

    public dataSource: NaturalDataSource;

    public columns;

    constructor(private productMetaService: ProductMetadataService) {
    }

    ngOnInit() {

        if (this.edit) {
            this.columns = ['name', 'value', 'delete'];
        } else {
            this.columns = ['name', 'value'];
        }

        if (this.product) {
            const variables: ProductMetadatasVariables = {
                filter: {groups: [{conditions: [{product: {equal: {value: this.product.id}}}]}]},
            };

            const qvm = new NaturalQueryVariablesManager<ProductMetadatasVariables>();
            qvm.set('variables', variables);

            // TODO : replace by watchAll because two admins may work on same object and meta data could change between two visits
            this.productMetaService.getAll(qvm).subscribe(products => {
                this.dataSource = new NaturalDataSource(products);
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
                this.dataSource.push(this.productMetaService.getConsolidatedForClient());
            }
        }
    }

    public updateOrCreate(meta) {

        meta.product = this.product.id;

        if (meta.name) {
            this.productMetaService.createOrUpdate(meta).subscribe(() => {
            });

            this.addLine();

        } else if (meta.name === '' && meta.value === '' && meta.id) {
            // If has ID and empty attributes, remove it
            this.delete(meta);
        }

    }

    public delete(meta) {
        this.productMetaService.delete([meta]).subscribe(() => {
            this.dataSource.remove(meta);
        });
    }

}
