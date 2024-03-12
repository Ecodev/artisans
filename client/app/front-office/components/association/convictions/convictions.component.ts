import {Component} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-convictions',
    templateUrl: './convictions.component.html',
    styleUrl: './convictions.component.scss',
    standalone: true,
    imports: [FlexModule],
})
export class ConvictionsComponent {}
