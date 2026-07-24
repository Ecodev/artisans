import {inject, Injectable} from '@angular/core';
import {type NaturalLoggerExtra, type NaturalLoggerType} from '@ecodev/natural';
import {type Observable, of} from 'rxjs';
import {UserService} from '../../admin/users/services/user.service';
import {localConfig} from '../generated-config';

@Injectable({
    providedIn: 'root',
})
export class LoggerExtraService implements NaturalLoggerExtra {
    private readonly userService = inject(UserService);

    public getExtras(): Observable<Partial<NaturalLoggerType>> {
        return of({
            viewer: this.userService.getViewerValue(Infinity)?.email,
            app: {
                version: localConfig.version,
            },
        });
    }
}
