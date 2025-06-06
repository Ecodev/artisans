import {Component, inject} from '@angular/core';
import {CartService} from '../../modules/cart/services/cart.service';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-faire-un-don',
    templateUrl: './faire-un-don.component.html',
    styleUrl: './faire-un-don.component.scss',
    imports: [RouterLink, MatButtonModule],
})
export class FaireUnDonComponent {
    public readonly cartService = inject(CartService);
}
