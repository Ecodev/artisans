import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-legal-mentions',
    templateUrl: './legal-mentions.component.html',
    styleUrl: './legal-mentions.component.scss',
    standalone: true,
    imports: [RouterLink],
})
export class LegalMentionsComponent {}
