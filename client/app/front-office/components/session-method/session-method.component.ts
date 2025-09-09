import {Component} from '@angular/core';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-session-method',
    imports: [RouterLink, SessionSideColumnComponent],
    templateUrl: './session-method.component.html',
    styleUrl: './session-method.component.scss',
})
export class SessionMethodComponent {}
