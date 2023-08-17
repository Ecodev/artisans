import {Component, OnInit} from '@angular/core';
import {UntypedFormArray, UntypedFormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    NaturalAbstractDetail,
    NaturalSeoBasic,
    NaturalDetailHeaderComponent,
    NaturalLinkableTabDirective,
    NaturalIconDirective,
    NaturalRelationsComponent,
    NaturalTableButtonComponent,
    NaturalHttpPrefixDirective,
    NaturalStampComponent,
    NaturalFixedButtonDetailComponent,
} from '@ecodev/natural';
import {UserService} from '../../users/services/user.service';
import {SessionService} from '../services/session.service';
import {SessionResolve} from '../session';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NaturalEditorComponent} from '@ecodev/natural-editor';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatTabsModule,
        NaturalLinkableTabDirective,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        NaturalEditorComponent,
        MatDatepickerModule,
        TextFieldModule,
        MatButtonModule,
        MatIconModule,
        NaturalIconDirective,
        NaturalRelationsComponent,
        NaturalTableButtonComponent,
        MatDividerModule,
        NaturalHttpPrefixDirective,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
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
        public readonly userService: UserService,
    ) {
        super('session', sessionService);
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
