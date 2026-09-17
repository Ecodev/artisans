import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {mockApolloProvider} from '../../../shared/testing/MockApolloProvider';
import {ProductService} from './product.service';

describe('ProductService', () => {
    let service: ProductService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([]), mockApolloProvider],
        });

        service = TestBed.inject(ProductService);
    });

    it('should not submit description when only other fields changed', () => {
        expect(service.getInput({id: '123', name: 'foo'}, false)).toEqual({name: 'foo'});
    });

    it('should submit empty description instead of null', () => {
        expect(service.getInput({id: '123', description: null}, false)).toEqual({description: ''});
    });

    it('should default description on creation', () => {
        expect(service.getInput({name: 'foo'}, true).description).toBe('');
    });
});
