import {Component} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    standalone: true,
    imports: [FlexModule],
})
export class ContactComponent {}
