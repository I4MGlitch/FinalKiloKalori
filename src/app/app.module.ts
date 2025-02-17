import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CakeProductsPageComponent } from './cake-products-page/cake-products-page.component';
import { DessertProductsPageComponent } from './dessert-products-page/dessert-products-page.component';
import { ArticlePageComponent } from './article-page/article-page.component';
import { ArticleDetailsPageComponent } from './article-details-page/article-details-page.component';
import { AboutUsPageComponent } from './about-us-page/about-us-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CakeProductsPageComponent,
    DessertProductsPageComponent,
    ArticlePageComponent,
    ArticleDetailsPageComponent,
    AboutUsPageComponent,
    LoginPageComponent,
    AdminPageComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
