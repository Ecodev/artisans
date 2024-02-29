import {Component, OnInit} from '@angular/core';
import {
    NaturalAbstractList,
    NaturalFileService,
    NaturalSearchComponent,
    NaturalSrcDensityDirective,
    NaturalIconDirective,
    NaturalCapitalizePipe,
    NaturalEnumPipe,
} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PurchaseService} from './purchase.service';
import {ProductType, Purchases} from '../../../shared/generated-types';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {RouterLink} from '@angular/router';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-purchases',
    templateUrl: './purchases.component.html',
    styleUrls: ['./purchases.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FlexModule,
        NaturalSearchComponent,
        ExtendedModule,
        RouterLink,
        NaturalSrcDensityDirective,
        MatRippleModule,
        MatButtonModule,
        MatIconModule,
        NaturalIconDirective,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalCapitalizePipe,
        NaturalEnumPipe,
    ],
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
        if (orderLine.product?.file) {
            return this.naturalFileService.getDownloadLink(orderLine.product.file);
        }

        return null;
    }

    public canDownload(orderLine: Purchases['purchases']['items'][0]): boolean {
        const isDigital = orderLine.type === ProductType.both || orderLine.type === ProductType.digital;
        const hasFile = orderLine.product?.file;

        return isDigital && !!hasFile;
    }
}
