import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeProductsPageComponent } from './cake-products-page.component';

describe('CakeProductsPageComponent', () => {
  let component: CakeProductsPageComponent;
  let fixture: ComponentFixture<CakeProductsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CakeProductsPageComponent]
    });
    fixture = TestBed.createComponent(CakeProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
