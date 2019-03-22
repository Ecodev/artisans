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

    const expectedLink = {
        data: {
            linkBookingBookable: booking,
        },
    };


    const expectedUnlink = {
        data: {
            unlinkBookingBookable: booking,
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
        service.link(booking, item, null, {isMain: true}).subscribe(v => actual = v);
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

    // TODO: Unfortunately we don't have a model that allow use to easily test semantic linking
    // TODO: This should be restored if/when we a model that allow it again, or it should be ported to OKpilot
    // const category1 = {id: '456', __typename: 'Category'};
    // const category2 = {id: '789', __typename: 'Category'};
    // const expectedCategoryLink = {
    //     data: {
    //         linkCategoryParent: category1,
    //     },
    // };
    //
    // it('should be able to link with specific semantic', fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
    //     let actual: any = null;
    //     tick();
    //     service.link(category1, category2, 'parent').subscribe(v => actual = v);
    //     tick();
    //
    //     expect(actual).toEqual(expectedCategoryLink);
    // })));
    //
    // it('should be able to link with specific semantic in reverse order and have different result',
    //     fakeAsync(inject([LinkMutationService], (service: LinkMutationService) => {
    //         let actual: any = null;
    //         tick();
    //         service.link(category2, category1, 'parent').subscribe(v => actual = v);
    //         tick();
    //
    //         expect(actual).toEqual(expectedCategoryLink);
    //     })),
    // );
});
