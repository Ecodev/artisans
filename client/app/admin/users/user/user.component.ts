import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import {
    CreateUser,
    CreateUserVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserVariables,
} from '../../../shared/generated-types';
import { SessionService } from '../../sessions/services/session.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent
    extends NaturalAbstractDetail<User['user'],
        UserVariables,
        CreateUser['createUser'],
        CreateUserVariables,
        UpdateUser['updateUser'],
        UpdateUserVariables,
        any> implements OnInit {

    public UserService = UserService;

    public nextCodeAvailable: number;

    constructor(private userService: UserService,
                injector: Injector,
                public sessionService: SessionService,
    ) {
        super('user', userService, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        // Disable fields that should be imported from Cresus
        ['phone', 'membershipBegin', 'membershipEnd'].forEach(path => {
            const control = this.form.get(path);
            if (control) {
                control.disable();
            }
        })

        this.userService.getNextCodeAvailable().subscribe(code => {
            this.nextCodeAvailable = code;
        });

    }

}
