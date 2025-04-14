import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalFixedButtonDetailComponent,
    NaturalHttpPrefixDirective,
    NaturalIconDirective,
    NaturalLinkableTabDirective,
    NaturalRelationsComponent,
    NaturalSeoResolveData,
    NaturalStampComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {UserService} from '../../users/services/user.service';
import {SessionService} from '../services/session.service';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NaturalEditorComponent} from '@ecodev/natural-editor';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrl: './session.component.scss',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatTabsModule,
        NaturalLinkableTabDirective,
        MatFormFieldModule,
        MatInputModule,
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
export class SessionComponent extends NaturalAbstractDetail<SessionService, NaturalSeoResolveData> implements OnInit {
    public readonly userService = inject(UserService);

    /**
     * Array of form controls dedicated to dates display
     */
    public datesForm!: FormArray;

    public constructor() {
        super('session', inject(SessionService));
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        // Overrides form with array by array of forms
        this.datesForm = new FormArray(this.data.model.dates?.map(date => new FormControl(date)) ?? []);
        this.form.setControl('dates', this.datesForm);
    }

    public addDate(): void {
        this.datesForm.push(new FormControl(''));
    }
}
