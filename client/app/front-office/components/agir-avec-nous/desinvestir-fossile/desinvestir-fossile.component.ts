import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-desinvestir-fossile',
    templateUrl: './desinvestir-fossile.component.html',
    styleUrl: './desinvestir-fossile.component.scss',
    standalone: true,
    imports: [RouterLink, MatButtonModule],
})
export class DesinvestirFossileComponent {}
