import { inject, TestBed } from '@angular/core/testing';
import { EnumService } from './enum.service';
import { MockApolloProvider } from '../testing/MockApolloProvider';

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
                value: 'none',
                name: ' ',
            },
            {
                value: 'to_verify',
                name: '? - À vérifier',
            },
            {
                value: 'ok',
                name: '✓ - OK',
            },
            {
                value: 'confirmed',
                name: '✓✓ - Confirmé',
            },
        ];

        const actual = service.get('Visa');
        actual.subscribe(v => expect(v).toEqual(expected));
    }));
});
