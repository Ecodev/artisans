import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from './user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { userMetaTesting } from '../../../shared/testing/userMetaTesting';
import { MockApolloProvider } from '../../../shared/testing/MockApolloProvider';
import { AbstractModelServiceSpec } from '../../../shared/testing/AbstractModelServiceSpec';

describe('UserService', () => {

    const expectedOne = {
        id: '456',
        name: 'test string',
        firstName: 'test string',
        lastName: 'test string',
        email: 'test@example.com',
        phone: 'test string',
        postcode: 'test string',
        street: 'test string',
        locality: 'test string',
        birthday: '2018-02-27',
        updateDate: '2018-01-18T11:43:31',
        login: 'test string',
        familyRelationship: 'householder',
        country: {
            id: '456',
            name: 'test string',
            __typename: 'Country',
        },
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

    AbstractModelServiceSpec.test(UserService, true, true, true, true, true, false);

    it('should get current user', fakeAsync(inject([UserService], (service: UserService) => {
        let actual: any = null;
        service.getCurrentUser().subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedOne);
    })));

    it('should login', fakeAsync(inject([
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

        // Mock router to do nothing when navigating
        const navigate = spyOn(router, 'navigate').and.callFake(() => Promise.resolve());

        let actual;
        service.logout().subscribe(v => actual = v);
        tick();

        expect(actual).toBe(true);
        expect(resetStore).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith(['/login'], {queryParams: {logout: true}});
    })));
});
