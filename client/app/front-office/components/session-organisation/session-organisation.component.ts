import {Component} from '@angular/core';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';

@Component({
    selector: 'app-session-organisation',
    templateUrl: './session-organisation.component.html',
    styleUrl: './session-organisation.component.scss',
    standalone: true,
    imports: [SessionSideColumnComponent],
})
export class SessionOrganisationComponent {}
