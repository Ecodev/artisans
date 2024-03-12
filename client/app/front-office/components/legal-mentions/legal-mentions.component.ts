import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-legal-mentions',
    templateUrl: './legal-mentions.component.html',
    styleUrl: './legal-mentions.component.scss',
    standalone: true,
    imports: [FlexModule, RouterLink],
})
export class LegalMentionsComponent {}
