import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTagsNavigationComponent } from './product-tags-navigation.component';

describe('ProductTagsNavigationComponent', () => {
  let component: ProductTagsNavigationComponent;
  let fixture: ComponentFixture<ProductTagsNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTagsNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTagsNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
