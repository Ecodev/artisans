import { inject, TestBed } from '@angular/core/testing';
import { EnumService } from './enum.service';
import { MockApolloProvider } from '../../shared/testing/MockApolloProvider';

describe('EnumService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockApolloProvider,
            ],
        });
    });

    it('should be created', inject([EnumService], (service: EnumService) => {
        expect(service).toBeTruthy();

        const expected = [
            {
                value: 'application',
                name: 'Demande en attente',
            },
            {
                value: 'processed',
                name: 'Demande traitée',
            },
            {
                value: 'booked',
                name: 'Réservé',
            },
        ];

        const actual = service.get('BookingStatus');
        actual.subscribe(v => expect(v).toEqual(expected));
    }));
});
