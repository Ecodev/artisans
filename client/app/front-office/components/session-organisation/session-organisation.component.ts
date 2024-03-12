import {Component} from '@angular/core';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-session-organisation',
    templateUrl: './session-organisation.component.html',
    styleUrl: './session-organisation.component.scss',
    standalone: true,
    imports: [FlexModule, ExtendedModule, SessionSideColumnComponent],
})
export class SessionOrganisationComponent {}
