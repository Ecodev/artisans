import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {

    public mode;
    public CartService = CartService;

    constructor(public cartService: CartService) {
    }

    ngOnInit() {
    }

}
