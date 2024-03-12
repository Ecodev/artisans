import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-alimentation',
    templateUrl: './alimentation.component.html',
    styleUrl: './alimentation.component.scss',
    standalone: true,
    imports: [FlexModule, RouterLink],
})
export class AlimentationComponent {}
