import {deliverableEmail, NaturalErrorMessagePipe} from '@ecodev/natural';
import {Component, inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';

export type EmailsData = {
    title: string;
    emails?: string[];
    required?: boolean;
};

@Component({
    selector: 'app-emails',
    imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatError,
        NaturalErrorMessagePipe,
        MatInput,
        MatButton,
    ],
    templateUrl: './emails.component.html',
    styleUrl: './emails.component.scss',
})
export class EmailsComponent {
    protected readonly dialogData = inject<EmailsData>(MAT_DIALOG_DATA);

    protected readonly form: FormGroup = new FormGroup({});

    /**
     * Array of form controls dedicated to emails
     */
    protected readonly emailsControl: FormArray;

    public constructor() {
        const dialogData = this.dialogData;

        const emails: string[] = dialogData.emails ?? [''];
        const validators = dialogData.required ? [Validators.required, deliverableEmail] : [deliverableEmail];
        this.emailsControl = new FormArray(emails.map(email => new FormControl(email, validators)));
        this.form.setControl('emails', this.emailsControl);
    }

    protected validEmails(): string[] {
        return this.emailsControl.getRawValue().filter(email => email);
    }
}
