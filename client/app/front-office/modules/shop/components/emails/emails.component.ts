import {Component, inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {deliverableEmail} from '@ecodev/natural';
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
    imports: [MatDialogModule, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInput, MatButton],
    templateUrl: './emails.component.html',
    styleUrl: './emails.component.scss',
})
export class EmailsComponent {
    public readonly dialogData = inject<EmailsData>(MAT_DIALOG_DATA);

    public readonly form: FormGroup = new FormGroup({});

    /**
     * Array of form controls dedicated to emails
     */
    public readonly emailsControl: FormArray;

    public constructor() {
        const dialogData = this.dialogData;

        const emails: string[] = dialogData.emails ?? [''];
        const validators = dialogData.required ? [Validators.required, deliverableEmail] : [deliverableEmail];
        this.emailsControl = new FormArray(emails.map(email => new FormControl(email, validators)));
        this.form.setControl('emails', this.emailsControl);
    }

    public validEmails(): string[] {
        return this.emailsControl.getRawValue().filter(email => email);
    }
}
