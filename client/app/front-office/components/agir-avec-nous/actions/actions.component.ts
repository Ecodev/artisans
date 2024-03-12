import {Component} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrl: './actions.component.scss',
    standalone: true,
    imports: [FlexModule],
})
export class ActionsComponent {}
