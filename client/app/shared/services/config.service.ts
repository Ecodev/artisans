import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface FrontEndConfig {
    datatrans: {
        merchantId: string;
        key: string;
        sign: string;
        production: boolean;
        endpoint: string;
    };
}

@Injectable({
    providedIn: 'root',
})
export class ConfigService {

    private configUrl = 'assets/config/config.local.json';
    private config = new BehaviorSubject<FrontEndConfig | null>(null);

    constructor(private http: HttpClient) {
        this.http.get<FrontEndConfig>(this.configUrl).pipe(catchError(() => {
            console.error('La configuration front-end n\'a pas pu être chargée !');
            return of(null);
        })).subscribe(result => {
            if (result) {
                this.config.next(result);
            }
        });

    }

    public get(): Observable<FrontEndConfig | null> {
        return this.config;
    }
}
