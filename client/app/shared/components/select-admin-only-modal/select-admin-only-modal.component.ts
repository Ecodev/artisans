import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../admin/products/services/product.service';
import { ProductTagService } from '../../../admin/productTags/services/productTag.service';

@Component({
    selector: 'natural-select-admin-only-modal',
    templateUrl: './select-admin-only-modal.component.html',
})
export class SelectAdminOnlyModalComponent implements OnInit {

    public selection;
    public variables = ProductService.adminByTag(ProductTagService.STORAGE);

    constructor(public productService: ProductService) {
    }

    ngOnInit() {
    }

}
