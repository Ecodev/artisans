import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {ConfigurationService} from '../../../configuration/services/configuration.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatCard} from '@angular/material/card';
import {NaturalIconDirective} from '@ecodev/natural';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButton, MatFabButton} from '@angular/material/button';
import {AsyncPipe} from '@angular/common';

type Block = {
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
};

@Component({
    selector: 'app-home-block',
    imports: [
        MatButton,
        MatFabButton,
        RouterLink,
        MatIcon,
        NaturalIconDirective,
        MatCard,
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatHint,
        MatInput,
        CdkTextareaAutosize,
        AsyncPipe,
    ],
    templateUrl: './home-block.component.html',
    styleUrl: './home-block.component.scss',
})
export class HomeBlockComponent implements OnInit {
    private readonly configService = inject(ConfigurationService);
    public readonly permissionsService = inject(PermissionsService);

    public readonly key = input.required<string>();

    public editMode = false;

    public form!: FormGroup;

    public lastValue: Block | null = null;

    public ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            buttonLabel: new FormControl(''),
            buttonLink: new FormControl(''),
        });

        const observables = [
            this.configService.get(this.key() + '-title'),
            this.configService.get(this.key() + '-description'),
            this.configService.get(this.key() + '-button-label'),
            this.configService.get(this.key() + '-button-link'),
        ];

        forkJoin(observables).subscribe(values => {
            this.lastValue = {
                title: values[0],
                description: values[1],
                buttonLabel: values[2],
                buttonLink: values[3],
            };
            this.form.setValue(this.lastValue);
        });
    }

    public update(): void {
        const key = this.key();
        this.configService.set(key + '-title', this.form.getRawValue().title);
        this.configService.set(key + '-description', this.form.getRawValue().description);
        this.configService.set(key + '-button-label', this.form.getRawValue().buttonLabel);
        this.configService.set(key + '-button-link', this.form.getRawValue().buttonLink);
        this.lastValue = this.form.getRawValue();
    }

    public reset(): void {
        if (this.lastValue) {
            this.form.setValue(this.lastValue);
        }
        this.editMode = false;
    }
}
