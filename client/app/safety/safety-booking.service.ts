import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BookingService } from '../admin/bookings/services/booking.service';
import { LinkMutationService } from '../shared/services/link-mutation.service';
import { EnumService } from '../shared/services/enum.service';
import gql from 'graphql-tag';
import { bookableMetaFragment } from '../admin/bookables/services/bookable.queries';

const safetyBookings = gql`
    query SafetyBookings($filter: BookingFilter, $sorting: [BookingSorting!], $pagination: PaginationInput) {
        bookings(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                destination
                startComment
                startDate
                endComment
                endDate
                estimatedEndDate
                creationDate
                updateDate
                participantCount
                status
                bookable {
                    id
                    name
                    image {
                        id
                    }
                    ...bookableMeta
                }
            }
            pageSize
            pageIndex
            length
            totalParticipantCount
            totalInitialPrice
            totalPeriodicPrice
        }
    }
    ${bookableMetaFragment}
`;

@Injectable({
    providedIn: 'root',
})
export class SafetyBookingService extends BookingService {

    constructor(apollo: Apollo, enumService: EnumService, linkMutationService: LinkMutationService) {
        super(apollo, enumService, linkMutationService);
        this.allQuery = safetyBookings;
    }

}
