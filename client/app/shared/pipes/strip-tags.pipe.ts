import {Pipe, PipeTransform} from '@angular/core';
import {striptags} from 'striptags';

@Pipe({
    name: 'stripTags',
})
export class StripTagsPipe implements PipeTransform {
    public transform(value: string): string {
        return striptags(value ?? '', {allowedTags: new Set(['strong', 'em', 'u'])});
    }
}
