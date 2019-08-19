import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
import { ProductTags, ProductTagsVariables } from '../../../shared/generated-types';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { ProductTagService } from '../services/productTag.service';

@Component({
    selector: 'app-product-tags',
    templateUrl: './productTags.component.html',
    styleUrls: ['./productTags.component.scss'],
})
export class ProductTagsComponent extends NaturalAbstractList<ProductTags['productTags'], ProductTagsVariables> implements OnInit {

    constructor(productTagService: ProductTagService,
                injector: Injector,
                public permissionsService: PermissionsService,
    ) {

        super(productTagService, injector);

    }
}
