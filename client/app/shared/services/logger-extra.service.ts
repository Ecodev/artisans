import {Injectable} from '@angular/core';
import {NaturalLoggerExtra, NaturalLoggerType} from '@ecodev/natural';
import {Observable, of} from 'rxjs';
import {UserService} from '../../admin/users/services/user.service';

@Injectable({
    providedIn: 'root',
})
export class LoggerExtraService implements NaturalLoggerExtra {
    public constructor(private readonly userService: UserService) {}

    public getExtras(error: unknown): Observable<Partial<NaturalLoggerType>> {
        return of({viewer: this.userService.getViewerValue(Infinity)?.email});
    }
}
