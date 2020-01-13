import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ArtisansModule } from '../../../../../shared/modules/artisans.module';
import { MaterialModule } from '../../../../../shared/modules/material.module';
import { mockApolloProvider } from '../../../../../shared/testing/MockApolloProvider';
import { CartModule } from '../../cart.module';

import { CreateOrderComponent } from './create-order.component';

describe('CreateOrderComponent', () => {
    let component: CreateOrderComponent;
    let fixture: ComponentFixture<CreateOrderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                ArtisansModule,
                MaterialModule,
                CartModule,
                RouterTestingModule,
            ],
            providers: [
                mockApolloProvider,
                {
                    provide: ActivatedRoute, useValue: {
                        snapshot: {
                            data: {viewer: {model: {}}},
                            params: {cartId: '0'},
                        },
                    },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
