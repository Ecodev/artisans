import {Component, inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {ConfigurationService} from '../../../configuration/services/configuration.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {NaturalIconDirective} from '@ecodev/natural';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
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
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        AsyncPipe,
    ],
    templateUrl: './home-block.component.html',
    styleUrl: './home-block.component.scss',
})
export class HomeBlockComponent implements OnInit {
    private readonly configService = inject(ConfigurationService);
    public readonly permissionsService = inject(PermissionsService);

    @Input({required: true}) public key!: string;

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
            this.configService.get(this.key + '-title'),
            this.configService.get(this.key + '-description'),
            this.configService.get(this.key + '-button-label'),
            this.configService.get(this.key + '-button-link'),
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
        this.configService.set(this.key + '-title', this.form.getRawValue().title);
        this.configService.set(this.key + '-description', this.form.getRawValue().description);
        this.configService.set(this.key + '-button-label', this.form.getRawValue().buttonLabel);
        this.configService.set(this.key + '-button-link', this.form.getRawValue().buttonLink);
        this.lastValue = this.form.getRawValue();
    }

    public reset(): void {
        if (this.lastValue) {
            this.form.setValue(this.lastValue);
        }
        this.editMode = false;
    }
}
