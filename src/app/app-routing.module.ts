import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CakeProductsPageComponent } from './cake-products-page/cake-products-page.component';
import { DessertProductsPageComponent } from './dessert-products-page/dessert-products-page.component';
import { ArticlePageComponent } from './article-page/article-page.component';
import { ArticleDetailsPageComponent } from './article-details-page/article-details-page.component';
import { AboutUsPageComponent } from './about-us-page/about-us-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: HomePageComponent },
  { path: 'home-page', component: HomePageComponent },
  { path: 'cake-products-page', component: CakeProductsPageComponent },
  { path: 'cake-products-page/:category/:id', component: CakeProductsPageComponent },
  { path: 'dessert-products-page', component: DessertProductsPageComponent },
  { path: 'dessert-products-page/:category', component: DessertProductsPageComponent },
  { path: 'article-page', component: ArticlePageComponent },
  { path: 'article-details-page', component: ArticleDetailsPageComponent },
  { path: 'article-details-page/:id', component: ArticleDetailsPageComponent },
  { path: 'about-us-page', component: AboutUsPageComponent },
  { path: 'login-page', component: LoginPageComponent },
  { path: 'admin-page', component: AdminPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
