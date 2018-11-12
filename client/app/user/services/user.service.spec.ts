import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from './user.service';
import { MockApolloProvider } from '../../shared/testing/MockApolloProvider';
import { AbstractModelServiceSpec } from '../../shared/testing/AbstractModelServiceSpec';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { userMetaTesting } from '../../shared/testing/userMetaTesting';

describe('UserService', () => {

    const expectedOne = {
        id: '456',
        name: 'test string',
        email: 'test@example.com',
        phone: 'test string',
        birthday: '2018-02-27',
        updateDate: '2018-01-18T11:43:31',
        login: 'test string',
        creator: userMetaTesting,
        updater: userMetaTesting,
        __typename: 'User',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
            ],
            providers: [
                MockApolloProvider,
            ],
        });
    });

    AbstractModelServiceSpec.test(UserService, true, true, true, false, true, false);

    it('should get current user', fakeAsync(inject([UserService], (service: UserService) => {
        let actual: any = null;
        service.getCurrentUser().subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedOne);
    })));

    it('should login',
        fakeAsync(inject([
            UserService,
            Apollo,
        ], (service: UserService, apollo: Apollo) => {
            // Spy on resetStore
            const resetStore = spyOn(apollo.getClient(), 'resetStore').and.callThrough();

            let actual: any = null;
            service.login({
                login: 'foo',
                password: 'bar',
            }).subscribe(v => actual = v);
            tick();

            expect(actual).toEqual(expectedOne);
            expect(resetStore).toHaveBeenCalledTimes(1);
        })));

    it('should logout and redirect to /login', fakeAsync(inject([
        UserService,
        Apollo,
        Router,
    ], (service: UserService, apollo: Apollo, router: Router) => {
        // Spy on resetStore
        const resetStore = spyOn(apollo.getClient(), 'resetStore').and.callThrough();

        let actual: any = null;
        service.logout().subscribe(v => actual = v);
        tick();

        expect(actual).toBe(true);
        expect(resetStore).toHaveBeenCalledTimes(1);
    })));
});
