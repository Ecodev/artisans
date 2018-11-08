import { inject, TestBed } from '@angular/core/testing';
import { TimezonePreservingDateAdapter } from './timezone.preserving.date.adapter';

describe('TimezonePreservingDateAdapter', () => {
    const year = 2000;
    const month = 1;
    const day = 2;
    const date = new Date();

    // Use pattern because tests may be executed in different time zones
    const localDatePattern = /^"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}"$/;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimezonePreservingDateAdapter],
        });
    });

    it('should be created', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
        expect(adapter).toBeTruthy();
    }));

    describe('will serialize as local date after', () => {
        it('clone ', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
            expect(JSON.stringify(adapter.clone(date))).toMatch(localDatePattern);
        }));

        it('createDate ', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
            expect(JSON.stringify(adapter.createDate(year, month, day))).toMatch(localDatePattern);
        }));

        it('today ', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
            expect(JSON.stringify(adapter.today())).toMatch(localDatePattern);
        }));

        it('addCalendarYears', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
            expect(JSON.stringify(adapter.addCalendarYears(date, 1))).toMatch(localDatePattern);
        }));

        it('addCalendarMonths', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
            expect(JSON.stringify(adapter.addCalendarMonths(date, 1))).toMatch(localDatePattern);
        }));

        it('addCalendarDays', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
            expect(JSON.stringify(adapter.addCalendarDays(date, 1))).toMatch(localDatePattern);
        }));

        it('parse', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
            expect(JSON.stringify(adapter.parse('2018'))).toMatch(localDatePattern);
        }));

        it('deserialize', inject([TimezonePreservingDateAdapter], (adapter: TimezonePreservingDateAdapter) => {
            expect(JSON.stringify(adapter.deserialize('2018-09-04T16:03:10+09:00'))).toMatch(localDatePattern);
        }));
    });
});
