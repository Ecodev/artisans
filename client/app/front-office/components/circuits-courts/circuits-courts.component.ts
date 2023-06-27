import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-circuits-courts',
    templateUrl: './circuits-courts.component.html',
    styleUrls: ['./circuits-courts.component.scss'],
    standalone: true,
    imports: [FlexModule, RouterLink],
})
export class CircuitsCourtsComponent {}
