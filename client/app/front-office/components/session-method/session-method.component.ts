import {Component} from '@angular/core';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-session-method',
    templateUrl: './session-method.component.html',
    styleUrl: './session-method.component.scss',
    imports: [RouterLink, SessionSideColumnComponent],
})
export class SessionMethodComponent {}
