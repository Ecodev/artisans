import {Component, inject} from '@angular/core';
import {ErrorService} from '@ecodev/natural';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {NaturalIconDirective} from '@ecodev/natural';
import {MatIcon} from '@angular/material/icon';
import {type GraphQLFormattedError} from 'graphql';

@Component({
    selector: 'app-error',
    imports: [MatIcon, NaturalIconDirective, MatButton, RouterLink],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss',
})
export class ErrorComponent {
    protected readonly error: Error | GraphQLFormattedError | null;

    public constructor() {
        const errorService = inject(ErrorService);
        const route = inject(ActivatedRoute);

        this.error = errorService.getLastError();

        if (route.snapshot.data.notFound) {
            this.error = new Error(
                `La page que vous cherchez n'existe pas. Elle a peut-être été déplacée ou supprimée.`,
            );
        }
    }
}
