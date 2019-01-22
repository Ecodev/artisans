import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material';

@Injectable({
    providedIn: 'root',
})
export class TimezonePreservingDateAdapter extends NativeDateAdapter {

    public clone(date: Date): Date {
        const d = super.clone(date);

        return this.replaceJSON(d);
    }

    public createDate(year: number, month: number, date: number): Date {
        const d = super.createDate(year, month, date);

        return this.replaceJSON(d);
    }

    public today(): Date {
        const d = super.today();

        return this.replaceJSON(d);
    }

    public addCalendarYears(date: Date, years: number): Date {
        const d = super.addCalendarYears(date, years);

        return this.replaceJSON(d);
    }

    public addCalendarMonths(date: Date, months: number): Date {
        const d = super.addCalendarMonths(date, months);

        return this.replaceJSON(d);
    }

    public addCalendarDays(date: Date, days: number): Date {
        const d = super.addCalendarDays(date, days);

        return this.replaceJSON(d);
    }

    public parse(value: any): Date | null {
        const d = super.parse(value);
        if (d) {
            this.replaceJSON(d);
        }

        return d;
    }

    public deserialize(value: any): Date | null {
        const d = super.deserialize(value);
        if (d) {
            this.replaceJSON(d);
        }

        return d;
    }

    /**
     * Replace native toJSON() function by our own implementation that will preserve the local time zone.
     * This allow the server side to know the day (without time) that was selected on client side.
     */
    private replaceJSON(date: Date): Date {

        date.toJSON = function(): string {
            const timezoneOffsetInHours = -(date.getTimezoneOffset() / 60); // UTC minus local time
            const sign = timezoneOffsetInHours >= 0 ? '+' : '-';
            const leadingZero = (timezoneOffsetInHours < 10) ? '0' : '';
            const offsetMinutes = date.getTimezoneOffset() % 60;
            const leadingZeroMinutes = (offsetMinutes < 10) ? '0' : '';

            // It's a bit unfortunate that we need to construct a new Date instance
            // (we don't want _this_ Date instance to be modified)
            const correctedDate = new Date(date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds());
            correctedDate.setHours(date.getHours() + timezoneOffsetInHours);

            const iso = correctedDate.toISOString().replace(/\.\d{3}Z/, '').replace('Z', '');

            return iso + sign + leadingZero + Math.abs(timezoneOffsetInHours).toString() + ':' + leadingZeroMinutes + offsetMinutes;
        };

        return date;
    }
}
