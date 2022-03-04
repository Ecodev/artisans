import {BehaviorSubject} from 'rxjs';

export class UpToDateSubject<T> extends BehaviorSubject<T> {
    public time: Date;

    public constructor(_value: T) {
        super(_value);
        this.time = new Date();
    }

    public next(value: T): void {
        super.next(value);
        this.time = new Date();
    }

    public getUpToDateValue(expiration: number): T | null {
        const diff = +new Date() - +this.time;
        if (diff < expiration) {
            return this.value;
        }

        return null;
    }
}
