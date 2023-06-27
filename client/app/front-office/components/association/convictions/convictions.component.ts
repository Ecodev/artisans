import {Component} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-convictions',
    templateUrl: './convictions.component.html',
    styleUrls: ['./convictions.component.scss'],
    standalone: true,
    imports: [FlexModule],
})
export class ConvictionsComponent {}
