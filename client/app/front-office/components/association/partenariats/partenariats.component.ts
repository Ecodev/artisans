import {Component} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-partenariats',
    templateUrl: './partenariats.component.html',
    styleUrl: './partenariats.component.scss',
    standalone: true,
    imports: [FlexModule],
})
export class PartenariatsComponent {}
