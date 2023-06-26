import {Component, OnInit} from '@angular/core';
import {NaturalAbstractList, NaturalFileService} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PurchaseService} from './purchase.service';
import {ProductType, Purchases} from '../../../shared/generated-types';

@Component({
    selector: 'app-purchases',
    templateUrl: './purchases.component.html',
    styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent extends NaturalAbstractList<PurchaseService> implements OnInit {
    public ProductType = ProductType;

    public constructor(
        service: PurchaseService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        private readonly naturalFileService: NaturalFileService,
    ) {
        super(service);

        this.persistSearch = false;
    }

    public getDownloadLink(orderLine: Purchases['purchases']['items'][0]): null | string {
        if (orderLine.product && orderLine.product.file) {
            return this.naturalFileService.getDownloadLink(orderLine.product.file);
        }

        return null;
    }

    public canDownload(orderLine: Purchases['purchases']['items'][0]): boolean {
        const isDigital = orderLine.type === ProductType.both || orderLine.type === ProductType.digital;
        const hasFile = orderLine.product && orderLine.product.file;

        return isDigital && !!hasFile;
    }
}
