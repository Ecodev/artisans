import {Component, OnInit} from '@angular/core';
import {IEnum, NaturalAbstractDetail, NaturalSeoBasic} from '@ecodev/natural';
import {UserRole} from '../../../shared/generated-types';
import {SessionService} from '../../sessions/services/session.service';
import {UserService} from '../services/user.service';
import {UserResolve} from '../user';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent extends NaturalAbstractDetail<UserService> implements OnInit {
    public UserService = UserService;
    private userRolesAvailable: UserRole[] = [];

    /**
     * Override parent just to type it
     */
    public override data!: UserResolve & {seo: NaturalSeoBasic};

    public constructor(private readonly userService: UserService, public readonly sessionService: SessionService) {
        super('user', userService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        // Disable fields that should be imported from Cresus
        ['phone', 'membership'].forEach(path => {
            const control = this.form.get(path);
            if (control) {
                control.disable();
            }
        });
    }

    protected override initForm(): void {
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
