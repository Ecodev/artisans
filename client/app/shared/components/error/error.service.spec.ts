import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ErrorService } from './error.service';

describe('ErrorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ErrorService],
            imports: [
                RouterTestingModule,
            ],
        });
    });

    it('should be created', inject([ErrorService], (service: ErrorService) => {
        expect(service).toBeTruthy();
    }));
});
