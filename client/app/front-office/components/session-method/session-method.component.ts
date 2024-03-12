import {Component} from '@angular/core';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-session-method',
    templateUrl: './session-method.component.html',
    styleUrl: './session-method.component.scss',
    standalone: true,
    imports: [FlexModule, RouterLink, ExtendedModule, SessionSideColumnComponent],
})
export class SessionMethodComponent {}
