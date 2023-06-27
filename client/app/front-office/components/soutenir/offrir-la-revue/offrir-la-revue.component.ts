import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-offrir-la-revue',
    templateUrl: './offrir-la-revue.component.html',
    styleUrls: ['./offrir-la-revue.component.scss'],
    standalone: true,
    imports: [FlexModule, MatButtonModule, RouterLink],
})
export class OffrirLaRevueComponent {}
