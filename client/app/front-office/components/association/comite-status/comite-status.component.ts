import {Component} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-comite-status',
    templateUrl: './comite-status.component.html',
    styleUrl: './comite-status.component.scss',
    standalone: true,
    imports: [FlexModule],
})
export class ComiteStatusComponent {}
