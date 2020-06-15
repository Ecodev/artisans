import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, FormControl} from '@angular/forms';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {
    CreateSession,
    CreateSessionVariables,
    DeleteSessions,
    DeleteSessionsVariables,
    Session,
    SessionVariables,
    UpdateSession,
    UpdateSessionVariables,
} from '../../../shared/generated-types';
import {UserService} from '../../users/services/user.service';
import {SessionService} from '../services/session.service';

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.scss'],
})
export class SessionComponent
    extends NaturalAbstractDetail<
        Session['session'],
        SessionVariables,
        CreateSession['createSession'],
        CreateSessionVariables,
        UpdateSession['updateSession'],
        UpdateSessionVariables,
        DeleteSessions,
        DeleteSessionsVariables
    >
    implements OnInit {
    /**
     * Array of form controls dedicated to dates display
     */
    public datesForm: FormArray;

    constructor(private sessionService: SessionService, injector: Injector, public userService: UserService) {
        super('session', sessionService, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        // Overrides form with array by array of forms
        // Todo in natural : maybe complete AbstractDetailService.getFormConfig() to dynamically consider arrays
        this.datesForm = new FormArray(this.data.model.dates.map(date => new FormControl(date)));
        this.form.setControl('dates', this.datesForm);
    }

    public addDate() {
        this.datesForm.push(new FormControl(''));
    }
}
