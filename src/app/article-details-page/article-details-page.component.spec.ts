import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailsPageComponent } from './article-details-page.component';

describe('ArticleDetailsPageComponent', () => {
  let component: ArticleDetailsPageComponent;
  let fixture: ComponentFixture<ArticleDetailsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleDetailsPageComponent]
    });
    fixture = TestBed.createComponent(ArticleDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
