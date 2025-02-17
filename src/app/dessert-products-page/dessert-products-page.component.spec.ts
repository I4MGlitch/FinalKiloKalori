import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DessertProductsPageComponent } from './dessert-products-page.component';

describe('DessertProductsPageComponent', () => {
  let component: DessertProductsPageComponent;
  let fixture: ComponentFixture<DessertProductsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DessertProductsPageComponent]
    });
    fixture = TestBed.createComponent(DessertProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
