import {Component, Inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
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
    public readonly form: FormGroup = new FormGroup({});

    /**
     * Array of form controls dedicated to emails
     */
    public readonly emailsControl: FormArray;

    constructor(@Inject(MAT_DIALOG_DATA) public dialogData: EmailsData) {
        const emails: string[] = dialogData.emails ?? [''];
        const validators = dialogData.required ? [Validators.required, deliverableEmail] : [deliverableEmail];
        this.emailsControl = new FormArray(emails.map(email => new FormControl(email, validators)));
        this.form.setControl('emails', this.emailsControl);
    }

    public validEmails(): string[] {
        return this.emailsControl.getRawValue().filter(email => email);
    }
}
