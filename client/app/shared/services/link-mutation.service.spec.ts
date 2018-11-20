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

    const booking = {__typename: 'Booking'};
    const item = {__typename: 'Resource'};
    const company = {__typename: 'Company'};

    const expectBooking = {
        id: '456',
        __typename: 'Booking',
    };

    const expectedLink = {
        data: {
            linkBookingResource: expectBooking,
        },
    };

    const expectedUnlink = {
        data: {
            unlinkBookingResource: expectBooking,
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
        tick();
        expect(() => service.link(booking, company).subscribe()).toThrowError('API does not allow to link Company and Booking');
        tick();
    })));

    it('should throw for non-existing unlink mutation', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
        tick();
        expect(() => service.unlink(booking, company).subscribe()).toThrowError('API does not allow to unlink Company and Booking');
        tick();
    })));
});
