import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utility } from '../classes/utility';

@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {

    public transform(value: string | Observable<string>): string | Observable<string> {

        if (value instanceof Observable) {
            return value.pipe(map(val => this.getValue(val)));
        } else {
            return this.getValue(value);
        }

    }

    private getValue(value: string): string {
        if (value) {
            return Utility.upperCaseFirstLetter(value);
        }
        return value;
    }
}
