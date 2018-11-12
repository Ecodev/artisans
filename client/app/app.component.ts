import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { UserService } from './user/services/user.service';
import { BookingService } from './booking/services/booking.service';
import { ItemService } from './item/services/item.service';
import { QueryVariablesManager } from './shared/classes/query-variables-manager';
import { AlertService } from './shared/components/alert/alert.service';
import { PaginatedDataSource } from './shared/services/paginated.data.source';

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

    public columns = ['id', 'name'];

    constructor(private apollo: Apollo,
                private alertService: AlertService,
                private userService: UserService,
                private bookingService: BookingService,
                private itemService: ItemService) {
    }

    public ngOnInit(): void {

        this.userDS = this.getList(this.userService);
        this.itemDS = this.getList(this.itemService);
        this.bookingDS = this.getList(this.bookingService);

        this.userService.login({
            login: 'sam',
            password: 'sam',
        }).subscribe((res) => {
            console.log('logué en tant que ', res);
            this.alertService.info('Connecté en tant que sam');
        });

    }

    public getList(service) {
        const variables = new QueryVariablesManager();
        variables.set('variables', {});
        return new PaginatedDataSource(service.watchAll(variables, true).valueChanges, variables);
    }

    public addUser() {
        const userInput = {
            name: 'user' + Math.random(),
            login: 'user' + Math.random(),
            email: 'sam@' + Math.random() + '.com',
            password: 'sam',
        };
        this.userService.create(userInput).subscribe(result => {
            console.log('user created', result);
            this.alertService.info('user créé');
        });
    }

    public addItem() {
        this.itemService.create({name: 'item' + Math.random()}).subscribe(result => {
            console.log('item created', result);
            this.alertService.info('user créé');
        });
    }

    public addBooking() {
        this.bookingService.create({}).subscribe(result => {
            console.log('bookin created', result);
            this.alertService.info('user créé');
        });
    }
}
