import {inject, Injectable} from '@angular/core';
import {NaturalLoggerExtra, NaturalLoggerType} from '@ecodev/natural';
import {Observable, of} from 'rxjs';
import {UserService} from '../../admin/users/services/user.service';

@Injectable({
    providedIn: 'root',
})
export class LoggerExtraService implements NaturalLoggerExtra {
    private readonly userService = inject(UserService);

    public getExtras(): Observable<Partial<NaturalLoggerType>> {
        return of({viewer: this.userService.getViewerValue(Infinity)?.email});
    }
}
