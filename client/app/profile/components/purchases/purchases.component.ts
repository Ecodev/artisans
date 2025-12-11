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
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatRipple} from '@angular/material/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, DatePipe} from '@angular/common';

@Component({
    selector: 'app-purchases',
    imports: [
        AsyncPipe,
        DatePipe,
        NaturalSearchComponent,
        RouterLink,
        NaturalSrcDensityDirective,
        MatRipple,
        MatButton,
        MatIcon,
        NaturalIconDirective,
        MatProgressSpinner,
        MatPaginator,
        NaturalCapitalizePipe,
        NaturalEnumPipe,
    ],
    templateUrl: './purchases.component.html',
    styleUrl: './purchases.component.scss',
})
export class PurchasesComponent extends NaturalAbstractList<PurchaseService> implements OnInit {
    private readonly naturalFileService = inject(NaturalFileService);

    protected readonly ProductType = ProductType;

    public constructor() {
        super(inject(PurchaseService));

        this.persistSearch = false;
    }

    protected getDownloadLink(orderLine: Purchases['purchases']['items'][0]): null | string {
        if (orderLine.product?.file) {
            return this.naturalFileService.getDownloadLink(orderLine.product.file);
        }

        return null;
    }

    protected canDownload(orderLine: Purchases['purchases']['items'][0]): boolean {
        const isDigital = orderLine.type === ProductType.Both || orderLine.type === ProductType.Digital;
        const hasFile = orderLine.product?.file;

        return isDigital && !!hasFile;
    }
}
