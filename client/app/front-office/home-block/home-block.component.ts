import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ConfigurationService } from '../../configuration/services/configuration.service';
import { PermissionsService } from '../../shared/services/permissions.service';

@Component({
    selector: 'app-home-block',
    templateUrl: './home-block.component.html',
    styleUrls: ['./home-block.component.scss'],
})
export class HomeBlockComponent implements OnInit {

    @Input() key: string;

    public editMode = false;

    public form: FormGroup;

    public lastValue;

    constructor(private configService: ConfigurationService, public permissionService: PermissionsService) {
    }

    ngOnInit() {

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

    public update() {
        this.configService.set(this.key + '-title', this.form.getRawValue().title);
        this.configService.set(this.key + '-description', this.form.getRawValue().description);
        this.configService.set(this.key + '-button-label', this.form.getRawValue().buttonLabel);
        this.configService.set(this.key + '-button-link', this.form.getRawValue().buttonLink);
        this.lastValue = this.form.getRawValue();
    }

    public reset() {
        this.form.setValue(this.lastValue);
        this.editMode = false;
    }

}
