import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { UserService } from './user/services/user.service';
import { BookingService } from './booking/services/booking.service';
import { ItemService } from './item/services/item.service';
import { QueryVariablesManager } from './shared/classes/query-variables-manager';
import { AlertService } from './shared/components/alert/alert.service';
import { PaginatedDataSource } from './shared/services/paginated.data.source';
import { UserInput } from './shared/generated-types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'my-ichtus';

    public userDS;
    public itemDS;
    public bookingDS;

    public show = true;

    public userQueryRef;
    public itemQueryRef;
    public itemQVM;

    public columns = ['id', 'name'];

    constructor(private apollo: Apollo,
                private alertService: AlertService,
                private userService: UserService,
                public bookingService: BookingService,
                private itemService: ItemService) {
    }

    public ngOnInit(): void {

        const userList = this.getList(this.userService);
        this.userQueryRef = userList.queryRef;
        this.userDS = userList.dataSource;

        const itemList = this.getList(this.itemService);
        this.itemQueryRef = itemList.queryRef;
        this.itemDS = itemList.dataSource;
        this.itemQVM = itemList.variables;

        this.bookingDS = this.getList(this.bookingService).dataSource;
    }

    public changeItemQVM(nb) {
        this.itemQVM.set('pagination', {pagination: {pageIndex: 0, pageSize: nb}});
    }

    public login(): void {
        this.userService.login({
            login: 'administrator',
            password: 'administrator',
        }).subscribe(user => {
            console.log('logged in as', user);
            this.alertService.info('Connecté en tant que ' + user.name);
        });
    }

    public logout(): void {
        this.userService.logout().subscribe(() => {
            this.alertService.info('Déconnecté');
        });
    }

    public getList(service) {
        const variables = new QueryVariablesManager();
        variables.set('variables', {pagination: {pageIndex: 0, pageSize: 10}});
        const queryRef = service.watchAll(variables, true);
        return {
            dataSource: new PaginatedDataSource(queryRef.valueChanges, variables),
            queryRef: queryRef,
            variables: variables,
        };
    }

    public addUser(): void {
        const unique = 'user' + new Date().getTime();
        const userInput: UserInput = {
            login: unique,
            password: unique,
            name: unique,
            email: unique + '@example.com',
        };

        this.userService.create(userInput).subscribe(user => {
            this.alertService.info('user créé: ' + user.name);
        });
    }

    public addItem(): void {
        this.itemService.create({name: 'item' + new Date().getTime()}).subscribe(item => {
            this.alertService.info('item créé: ' + item.name);
        });
    }

    public addBooking(): void {
        this.bookingService.create({}).subscribe(booking => {
            this.alertService.info('booking créé: ' + booking.id);
        });
    }

    public getId(object): string {
        return object ? object.id : null;
    }
}
