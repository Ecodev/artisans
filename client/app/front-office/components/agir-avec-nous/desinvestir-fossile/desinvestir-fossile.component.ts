import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-desinvestir-fossile',
    templateUrl: './desinvestir-fossile.component.html',
    styleUrl: './desinvestir-fossile.component.scss',
    standalone: true,
    imports: [FlexModule, RouterLink, MatButtonModule],
})
export class DesinvestirFossileComponent {}
