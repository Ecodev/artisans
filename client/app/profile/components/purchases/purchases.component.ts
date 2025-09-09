import {Component, inject, OnInit} from '@angular/core';
import {
    NaturalAbstractList,
    NaturalCapitalizePipe,
    NaturalEnumPipe,
    NaturalFileService,
    NaturalIconDirective,
    NaturalSearchComponent,
    NaturalSrcDensityDirective,
} from '@ecodev/natural';
import {PurchaseService} from './purchase.service';
import {ProductType, Purchases} from '../../../shared/generated-types';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-purchases',
    imports: [
        CommonModule,
        NaturalSearchComponent,
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
    templateUrl: './purchases.component.html',
    styleUrl: './purchases.component.scss',
})
export class PurchasesComponent extends NaturalAbstractList<PurchaseService> implements OnInit {
    private readonly naturalFileService = inject(NaturalFileService);

    public ProductType = ProductType;

    public constructor() {
        super(inject(PurchaseService));

        this.persistSearch = false;
    }

    public getDownloadLink(orderLine: Purchases['purchases']['items'][0]): null | string {
        if (orderLine.product?.file) {
            return this.naturalFileService.getDownloadLink(orderLine.product.file);
        }

        return null;
    }

    public canDownload(orderLine: Purchases['purchases']['items'][0]): boolean {
        const isDigital = orderLine.type === ProductType.Both || orderLine.type === ProductType.Digital;
        const hasFile = orderLine.product?.file;

        return isDigital && !!hasFile;
    }
}
