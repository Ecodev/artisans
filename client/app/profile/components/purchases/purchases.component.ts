import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { PurchaseService } from './purchase.service';
import { ProductType, Purchases, Purchases_purchases_items, PurchasesVariables } from '../../../shared/generated-types';
import { getDownloadLink } from '../../../shared/components/file/file.component';

@Component({
    selector: 'app-purchases',
    templateUrl: './purchases.component.html',
    styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent extends NaturalAbstractList<Purchases['purchases'], PurchasesVariables> implements OnInit {

    public ProductType = ProductType;

    constructor(
        service: PurchaseService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(service, injector);
    }

    public getDownloadLink(orderLine: Purchases_purchases_items): null | string {
        if (orderLine.product && orderLine.product.file) {
            return getDownloadLink(orderLine.product.file);
        }

        return null;
    }

    public canDownload(orderLine: Purchases_purchases_items): boolean {
        const isDigital = orderLine.type === ProductType.both || orderLine.type === ProductType.digital;
        const hasFile = orderLine.product && orderLine.product.file;

        return isDigital && !!hasFile;
    }
}
