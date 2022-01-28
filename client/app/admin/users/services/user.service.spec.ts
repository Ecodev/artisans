import {Apollo} from 'apollo-angular';
import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {mockApolloProvider} from '../../../shared/testing/MockApolloProvider';
import {UserService} from './user.service';
import {memoryLocalStorageProvider, memorySessionStorageProvider} from '@ecodev/natural';
import {CartCollectionService} from '../../../front-office/modules/cart/services/cart-collection.service';
import {Observable} from 'rxjs';
import {Permissions_permissions} from 'client/app/shared/generated-types';

class MockCartCollectionService {
    private clear(): void {}
}

describe('UserService', () => {
    let service: UserService;
    let apollo: Apollo;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                mockApolloProvider,
                {
                    provide: CartCollectionService,
                    useClass: MockCartCollectionService,
                },
                memorySessionStorageProvider,
                memoryLocalStorageProvider,
            ],
        });

        service = TestBed.inject(UserService);
        apollo = TestBed.inject(Apollo);
        router = TestBed.inject(Router);

        // Mock permissions service
        const permissionsService = TestBed.inject(PermissionsService);
        permissionsService.setUser = () => null as unknown as Observable<Permissions_permissions>;
    });

    it('should get current user', fakeAsync(() => {
        let actual: any = null;
        service.fetchViewer().subscribe(v => (actual = v));
        tick(1000);

        expect(actual.__typename).toBe('User');
    }));

    it('should login', fakeAsync(() => {
        // Spy on resetStore
        const resetStore = spyOn(apollo.client, 'resetStore').and.callThrough();

        let actual: any = null;
        service.login({email: 'foo@example.com', password: 'bar'}).subscribe(v => (actual = v));
        tick(1000);

        expect(actual.__typename).toBe('User');
        expect(resetStore).toHaveBeenCalledTimes(1);
    }));

    it('should logout and redirect to /login', fakeAsync(() => {
        // Spy on resetStore
        const resetStore = spyOn(apollo.client, 'resetStore').and.callThrough();

        // Mock router to do nothing when navigating
        const navigate = spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));

        let actual: boolean | undefined;
        service.logout().subscribe(v => (actual = v));
        tick(1000);

        expect(actual).toBe(true);
        expect(resetStore).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith(['/login'], {queryParams: {logout: true}});
    }));
});
