import { EnumPipe } from './enum.pipe';
import { Observable, of } from 'rxjs';
import { EnumService, IEnum } from '../services/enum.service';
import { inject, TestBed } from '@angular/core/testing';

class EnumServiceStub {

    public get(name: string): Observable<IEnum[]> {
        return of([
            {
                value: 'val1',
                name: 'name1',
            },
            {
                value: 'val2',
                name: 'name2',
            },
            {
                value: 'val3',
                name: 'name3',
            },
        ]);
    }
}

describe('EnumPipe', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: EnumPipe,
                    useClass: EnumPipe,
                },
                {
                    provide: EnumService,
                    useClass: EnumServiceStub,
                },
            ],
        });
    });

    it('can get name of enum value', inject([EnumPipe], (pipe: EnumPipe) => {
        expect(pipe).toBeTruthy();

        pipe.transform('val1', 'enumName').subscribe(name => {
            expect(name).toBe('name1');
        });

        pipe.transform('val3', 'enumName').subscribe(name => {
            expect(name).toBe('name3');
        });

        pipe.transform(null, 'enumName').subscribe(name => {
            expect(name).toBe(null);
        });
    }));
});
