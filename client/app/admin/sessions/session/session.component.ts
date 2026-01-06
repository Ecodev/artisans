import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalErrorMessagePipe,
    NaturalFixedButtonDetailComponent,
    NaturalHttpPrefixDirective,
    NaturalIconDirective,
    NaturalLinkableTabDirective,
    NaturalRelationsComponent,
    NaturalSeoResolveData,
    NaturalStampComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../users/services/user.service';
import {SessionService} from '../services/session.service';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {NaturalEditorComponent} from '@ecodev/natural-editor';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
    selector: 'app-session',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatTab,
        MatTabGroup,
        NaturalLinkableTabDirective,
        MatFormField,
        MatLabel,
        MatError,
        NaturalErrorMessagePipe,
        MatHint,
        MatSuffix,
        MatInput,
        NaturalEditorComponent,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        CdkTextareaAutosize,
        MatButton,
        MatIconButton,
        MatIcon,
        NaturalIconDirective,
        NaturalRelationsComponent,
        NaturalTableButtonComponent,
        MatDivider,
        NaturalHttpPrefixDirective,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
    templateUrl: './session.component.html',
    styleUrl: './session.component.scss',
})
export class SessionComponent extends NaturalAbstractDetail<SessionService, NaturalSeoResolveData> implements OnInit {
    protected readonly userService = inject(UserService);

    /**
     * Array of form controls dedicated to dates display
     */
    protected datesForm!: FormArray;

    public constructor() {
        super('session', inject(SessionService));
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        // Overrides form with array by array of forms
        this.datesForm = new FormArray(this.data.model.dates?.map(date => new FormControl(date)) ?? []);
        this.form.setControl('dates', this.datesForm);
    }

    protected addDate(): void {
        this.datesForm.push(new FormControl(''));
    }
}
