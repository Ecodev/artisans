import {Component, inject} from '@angular/core';
import {CartService} from '../../modules/cart/services/cart.service';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-faire-un-don',
    imports: [RouterLink, MatButton],
    templateUrl: './faire-un-don.component.html',
    styleUrl: './faire-un-don.component.scss',
})
export class FaireUnDonComponent {
    protected readonly cartService = inject(CartService);
}
