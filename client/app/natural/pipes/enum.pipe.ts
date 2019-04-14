import { Pipe, PipeTransform } from '@angular/core';
import { EnumService } from '../services/enum.service';
import { map } from 'rxjs/operators';

/**
 * A pipe to output an enum user-friendly name, instead of its value.
 *
 * Usage would be: {{ element.priority | enum: 'Priority' | async }}
 */
@Pipe({
    name: 'enum',
})
export class EnumPipe implements PipeTransform {

    constructor(private  enumService: EnumService) {
    }

    transform(value: any, enumName: string): any {

        return this.enumService.get(enumName).pipe(map(a => {
            for (const v of a) {
                if (v.value === value) {
                    return v.name;
                }
            }

            return null;
        }));
    }

}
