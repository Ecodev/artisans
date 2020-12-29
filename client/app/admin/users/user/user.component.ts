import {Component, Injector, OnInit} from '@angular/core';
import {NaturalAbstractDetail, NaturalSeoBasic} from '@ecodev/natural';
import {
    CreateUser,
    CreateUserVariables,
    DeleteUsers,
    DeleteUsersVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserRole,
    UserVariables,
} from '../../../shared/generated-types';
import {SessionService} from '../../sessions/services/session.service';
import {UserService} from '../services/user.service';
import {UserResolve} from '../user';
import {IEnum} from '@ecodev/natural/lib/services/enum.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent
    extends NaturalAbstractDetail<
        User['user'],
        UserVariables,
        CreateUser['createUser'],
        CreateUserVariables,
        UpdateUser['updateUser'],
        UpdateUserVariables,
        DeleteUsers,
        DeleteUsersVariables
    >
    implements OnInit {
    public UserService = UserService;
    private userRolesAvailable: UserRole[] = [];

    /**
     * Override parent just to type it
     */
    public data!: UserResolve & {seo: NaturalSeoBasic};

    constructor(private userService: UserService, injector: Injector, public sessionService: SessionService) {
        super('user', userService, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        // Disable fields that should be imported from Cresus
        ['phone', 'membership'].forEach(path => {
            const control = this.form.get(path);
            if (control) {
                control.disable();
            }
        });
    }

    protected initForm(): void {
        super.initForm();

        this.userService.getUserRolesAvailable(this.data.model).subscribe(userRoles => {
            this.userRolesAvailable = userRoles;
        });
    }

    public roleDisabled(): (item: IEnum) => boolean {
        return item => {
            return !this.userRolesAvailable.includes(item.value as UserRole);
        };
    }
}
