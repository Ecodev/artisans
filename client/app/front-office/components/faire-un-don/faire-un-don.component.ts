import {Component} from '@angular/core';
import {CartService} from '../../modules/cart/services/cart.service';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-faire-un-don',
    templateUrl: './faire-un-don.component.html',
    styleUrl: './faire-un-don.component.scss',
    standalone: true,
    imports: [FlexModule, RouterLink, MatButtonModule],
})
export class FaireUnDonComponent {
    public constructor(public readonly cartService: CartService) {}
}
