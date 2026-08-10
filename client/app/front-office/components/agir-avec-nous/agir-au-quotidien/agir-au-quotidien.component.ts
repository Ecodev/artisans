import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-agir-au-quotidien',
    imports: [RouterLink],
    templateUrl: './agir-au-quotidien.component.html',
    styleUrl: './agir-au-quotidien.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class AgirAuQuotidienComponent {}
