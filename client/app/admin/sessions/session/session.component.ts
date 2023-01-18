import {Component, Injector, OnInit} from '@angular/core';
import {UntypedFormArray, UntypedFormControl} from '@angular/forms';
import {NaturalAbstractDetail, NaturalSeoBasic} from '@ecodev/natural';
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
    public datesForm!: UntypedFormArray;

    /**
     * Override parent just to type it
     */
    public override data!: SessionResolve & {seo: NaturalSeoBasic};

    public constructor(
        private readonly sessionService: SessionService,
        injector: Injector,
        public readonly userService: UserService,
    ) {
        super('session', sessionService, injector);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        // Overrides form with array by array of forms
        this.datesForm = new UntypedFormArray(this.data.model.dates.map(date => new UntypedFormControl(date)));
        this.form.setControl('dates', this.datesForm);
    }

    public addDate(): void {
        this.datesForm.push(new UntypedFormControl(''));
    }
}
