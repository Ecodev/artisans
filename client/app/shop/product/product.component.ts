import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cartService: CartService, private router: Router) {
        this.data.model = this.data.product.model; // to respect our template standard
    }

    ngOnInit() {
    }

    public addToCart() {
        this.cartService.add(this.data.model);
        this.router.navigateByUrl('/');
    }

}
