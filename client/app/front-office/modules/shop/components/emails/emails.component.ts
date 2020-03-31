import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-emails',
    templateUrl: './emails.component.html',
    styleUrls: ['./emails.component.scss'],
})
export class EmailsComponent implements OnInit {

    /**
     * Array of form controls dedicated to dates display
     */
    public form: FormGroup = new FormGroup({});

    constructor(@Inject(MAT_DIALOG_DATA) private dialogData) {

        // Prefill e-mails list with viewer
        const emails: string[] = dialogData.user ? [dialogData.user.email, '', ''] : ['', '', ''];
        this.form.setControl('emails', new FormArray(emails.map(email => new FormControl(email))));
    }

    ngOnInit(): void {
    }

}
