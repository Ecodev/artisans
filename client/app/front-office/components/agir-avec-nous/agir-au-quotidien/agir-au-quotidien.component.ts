import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-agir-au-quotidien',
    templateUrl: './agir-au-quotidien.component.html',
    styleUrls: ['./agir-au-quotidien.component.scss'],
    standalone: true,
    imports: [FlexModule, RouterLink],
})
export class AgirAuQuotidienComponent {}
