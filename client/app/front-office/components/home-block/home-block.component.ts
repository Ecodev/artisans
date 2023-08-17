import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {ConfigurationService} from '../../../configuration/services/configuration.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatCardModule} from '@angular/material/card';
import {NaturalIconDirective} from '@ecodev/natural';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

interface Block {
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
}

@Component({
    selector: 'app-home-block',
    templateUrl: './home-block.component.html',
    styleUrls: ['./home-block.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        MatCardModule,
        FlexModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
    ],
})
export class HomeBlockComponent implements OnInit {
    @Input({required: true}) public key!: string;

    public editMode = false;

    public form!: UntypedFormGroup;

    public lastValue: Block | null = null;

    public constructor(
        private readonly configService: ConfigurationService,
        public readonly permissionService: PermissionsService,
    ) {}

    public ngOnInit(): void {
        this.form = new UntypedFormGroup({
            title: new UntypedFormControl(''),
            description: new UntypedFormControl(''),
            buttonLabel: new UntypedFormControl(''),
            buttonLink: new UntypedFormControl(''),
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
