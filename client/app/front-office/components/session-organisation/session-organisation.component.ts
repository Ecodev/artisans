import {Component, ChangeDetectionStrategy} from '@angular/core';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';

@Component({
    selector: 'app-session-organisation',
    imports: [SessionSideColumnComponent],
    templateUrl: './session-organisation.component.html',
    styleUrl: './session-organisation.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class SessionOrganisationComponent {}
