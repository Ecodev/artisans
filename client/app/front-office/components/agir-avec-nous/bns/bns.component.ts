import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-bns',
    templateUrl: './bns.component.html',
    styleUrls: ['./bns.component.scss'],
    standalone: true,
    imports: [FlexModule, MatButtonModule, ExtendedModule, RouterLink],
})
export class BnsComponent {}
