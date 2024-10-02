import {Component, OnInit, inject} from '@angular/core';
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
    templateUrl: './purchases.component.html',
    styleUrl: './purchases.component.scss',
    standalone: true,
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
})
export class PurchasesComponent extends NaturalAbstractList<PurchaseService> implements OnInit {
    private readonly naturalFileService = inject(NaturalFileService);

    public ProductType = ProductType;

    public constructor() {
        const service = inject(PurchaseService);

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
