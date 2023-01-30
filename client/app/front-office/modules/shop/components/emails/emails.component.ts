import {Component, Inject} from '@angular/core';
import {UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import {deliverableEmail} from '@ecodev/natural';

export type EmailsData = {
    title: string;
    emails?: string[];
    required?: boolean;
};

@Component({
    selector: 'app-emails',
    templateUrl: './emails.component.html',
    styleUrls: ['./emails.component.scss'],
})
export class EmailsComponent {
    public readonly form: UntypedFormGroup = new UntypedFormGroup({});

    /**
     * Array of form controls dedicated to emails
     */
    public readonly emailsControl: UntypedFormArray;

    public constructor(@Inject(MAT_DIALOG_DATA) public readonly dialogData: EmailsData) {
        const emails: string[] = dialogData.emails ?? [''];
        const validators = dialogData.required ? [Validators.required, deliverableEmail] : [deliverableEmail];
        this.emailsControl = new UntypedFormArray(emails.map(email => new UntypedFormControl(email, validators)));
        this.form.setControl('emails', this.emailsControl);
    }

    public validEmails(): string[] {
        return this.emailsControl.getRawValue().filter(email => email);
    }
}
