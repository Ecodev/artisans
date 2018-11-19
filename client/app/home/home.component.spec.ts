import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NetworkActivityService } from '../shared/services/network-activity.service';
import { MatDialogModule, MatMenuModule, MatSidenavModule, MatSnackBarModule } from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionResolver } from '../actions/services/action.resolver';
import { DummyServices } from '../shared/testing/DummyServices';
import { QuestionResolver } from '../evaluation/services/question.resolver';
import { DocumentResolver } from '../documents/services/document.resolver';
import { ThemeService } from '../shared/services/theme.service';
import { ChecklistDocumentResolver } from '../documents/services/checklist-document.resolver';
import { MockApolloProvider } from '../shared/testing/MockApolloProvider';

class NetworkActivityServiceStub {
    public errors = new BehaviorSubject<any[]>([]);
}

class ThemeServiceStub {
    get theme() {
        return new BehaviorSubject<string>('default');
    }
}

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent,
            ],
            imports: [
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                FlexLayoutModule,
                MatSidenavModule,
                RouterTestingModule,
                MatMenuModule,
                MatSnackBarModule,
                PerfectScrollbarModule,
                MatDialogModule,
            ],
            providers: [
                {
                    provide: ThemeService,
                    useClass: ThemeServiceStub,
                },
                {
                    provide: NetworkActivityService,
                    useClass: NetworkActivityServiceStub,
                },
                {
                    provide: ActionResolver,
                    useClass: DummyServices,
                },
                {
                    provide: QuestionResolver,
                    useClass: DummyServices,
                },
                {
                    provide: DocumentResolver,
                    useClass: DummyServices,
                },
                {
                    provide: ChecklistDocumentResolver,
                    useClass: DummyServices,
                },
                MockApolloProvider,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
