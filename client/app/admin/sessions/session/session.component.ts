import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, FormControl} from '@angular/forms';
import {NaturalAbstractDetail, NaturalSeoBasic} from '@ecodev/natural';
import {
    CreateSession,
    CreateSessionVariables,
    DeleteSessions,
    DeleteSessionsVariables,
    Session,
    Session_session,
    SessionVariables,
    UpdateSession,
    UpdateSessionVariables,
} from '../../../shared/generated-types';
import {UserService} from '../../users/services/user.service';
import {SessionService} from '../services/session.service';
import {SessionResolve} from '../session';

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.scss'],
})
export class SessionComponent extends NaturalAbstractDetail<SessionService> implements OnInit {
    /**
     * Array of form controls dedicated to dates display
     */
    public datesForm!: FormArray;

    /**
     * Override parent just to type it
     */
    public data!: SessionResolve & {seo: NaturalSeoBasic};

    constructor(
        private readonly sessionService: SessionService,
        injector: Injector,
        public readonly userService: UserService,
    ) {
        super('session', sessionService, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        // Overrides form with array by array of forms
        this.datesForm = new FormArray(this.data.model.dates.map(date => new FormControl(date)));
        this.form.setControl('dates', this.datesForm);
    }

    public addDate(): void {
        this.datesForm.push(new FormControl(''));
    }
}
