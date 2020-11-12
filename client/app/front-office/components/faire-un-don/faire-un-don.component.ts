import {Component, OnInit} from '@angular/core';
import {CartService} from '../../modules/cart/services/cart.service';

@Component({
    selector: 'app-faire-un-don',
    templateUrl: './faire-un-don.component.html',
    styleUrls: ['./faire-un-don.component.scss'],
})
export class FaireUnDonComponent implements OnInit {
    constructor(public cartService: CartService) {}

    public ngOnInit(): void {}
}
