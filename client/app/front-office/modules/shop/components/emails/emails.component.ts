import {Component, Inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {deliverableEmail} from '@ecodev/natural';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

export type EmailsData = {
    title: string;
    emails?: string[];
    required?: boolean;
};

@Component({
    selector: 'app-emails',
    templateUrl: './emails.component.html',
    styleUrls: ['./emails.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class EmailsComponent {
    public readonly form: FormGroup = new FormGroup({});

    /**
     * Array of form controls dedicated to emails
     */
    public readonly emailsControl: FormArray;

    public constructor(@Inject(MAT_DIALOG_DATA) public readonly dialogData: EmailsData) {
        const emails: string[] = dialogData.emails ?? [''];
        const validators = dialogData.required ? [Validators.required, deliverableEmail] : [deliverableEmail];
        this.emailsControl = new FormArray(emails.map(email => new FormControl(email, validators)));
        this.form.setControl('emails', this.emailsControl);
    }

    public validEmails(): string[] {
        return this.emailsControl.getRawValue().filter(email => email);
    }
}
