import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MockApolloProvider } from '../shared/testing/MockApolloProvider';
import { LoginComponent } from './login.component';
import { UserService } from '../user/services/user.service';
import { NgProgressModule } from '@ngx-progressbar/core';

import {
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSnackBarModule,
    MatToolbarModule,
} from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { NetworkActivityService } from '../shared/services/network-activity.service';
import { LanguageSelectorComponent } from '../lang/language-selector/language-selector.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { IconComponent } from '../shared/components/icon/icon.component';

const user = {
    'id': '10',
    'login': 'tstadminsystem',
    'firstname': 'tstadminsystem',
    'lastname': 'tstadminsystem',
    'isActive': true,
};

class UserServiceStub {
    public getCurrentUser() {
        return new BehaviorSubject<any>(user);
    }
}

class NetworkActivityServiceStub {
    public errors = new BehaviorSubject<any[]>([]);
}

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent,
                LanguageSelectorComponent,
                IconComponent,
            ],
            imports: [
                NoopAnimationsModule,
                RouterTestingModule,
                FormsModule,
                MatInputModule,
                NgProgressModule.forRoot(),
                MatButtonModule,
                MatSnackBarModule,
                MatToolbarModule,
                PerfectScrollbarModule,
                MatMenuModule,
                MatDialogModule,
                MatIconModule,
            ],
            providers: [
                {
                    provide: NetworkActivityService,
                    useClass: NetworkActivityServiceStub,
                },
                {
                    provide: UserService,
                    useClass: UserServiceStub,
                },
                MockApolloProvider,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
