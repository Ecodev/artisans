import {Component} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-projet',
    templateUrl: './projet.component.html',
    styleUrls: ['./projet.component.scss'],
    standalone: true,
    imports: [FlexModule],
})
export class ProjetComponent {}
