import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-numerique-ethique',
    imports: [RouterLink],
    templateUrl: './numerique-ethique.component.html',
    styleUrl: './numerique-ethique.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class NumeriqueEthiqueComponent {}
