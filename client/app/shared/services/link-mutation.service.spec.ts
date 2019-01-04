import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockApolloProvider } from '../testing/MockApolloProvider';
import { LinkMutationService } from './link-mutation.service';

describe('LinkMutationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockApolloProvider,
            ],
        });
    });

    const booking = {id: '456', __typename: 'Booking'};
    const item = {id: '456', __typename: 'Bookable'};
    const company = {id: '456', __typename: 'Company'};

    const expectBooking = {
        id: '456',
        __typename: 'Booking',
    };

    const expectedLink = {
        data: {
            linkBookingBookable: expectBooking,
        },
    };

    const expectedUnlink = {
        data: {
            unlinkBookingBookable: expectBooking,
        },
    };

    it('should be able to link', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
        let actual: any = null;
        tick();
        service.link(booking, item).subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedLink);
    })));

    it('should be able to link in reverse order', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
        let actual: any = null;
        tick();
        service.link(item, booking).subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedLink);
    })));

    it('should be able to link with extra variables', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
        let actual: any = null;
        tick();
        service.link(booking, item, {isMain: true}).subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedLink);
    })));

    it('should be able to unlink', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
        let actual: any = null;
        tick();
        service.unlink(booking, item).subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedUnlink);
    })));

    it('should be able to unlink in reverse order', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
        let actual: any = null;
        tick();
        service.unlink(item, booking).subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedUnlink);
    })));

    it('should throw for non-existing link mutation', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
        let error: any = null;
        tick();
        service.link(booking, company).subscribe(() => null, (e) => error = e);
        tick();

        expect(error).not.toBeNull();
        expect(error.message).toEqual('API does not allow to link Booking and Company');
    })));

    it('should throw for non-existing unlink mutation', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
        let error: any = null;
        tick();
        service.unlink(booking, company).subscribe(() => null, (e) => error = e);
        tick();

        expect(error).not.toBeNull();
        expect(error.message).toEqual('API does not allow to unlink Booking and Company');
    })));
});
