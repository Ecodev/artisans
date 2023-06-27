import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-numerique-ethique',
    templateUrl: './numerique-ethique.component.html',
    styleUrls: ['./numerique-ethique.component.scss'],
    standalone: true,
    imports: [FlexModule, RouterLink],
})
export class NumeriqueEthiqueComponent {}
