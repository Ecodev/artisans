import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

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

    constructor(@Inject(MAT_DIALOG_DATA) private dialogData) {
        // Prefill e-mails list with viewer
        const emails: string[] = [dialogData.user ? dialogData.user.email : '', '', ''];
        this.emailsControl = new FormArray(emails.map(email => new FormControl(email, Validators.email)));
        this.form.setControl('emails', this.emailsControl);
    }

    public validEmails(): string[] {
        return this.emailsControl.getRawValue().filter(email => email);
    }
}
