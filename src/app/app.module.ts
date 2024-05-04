import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateOfferComponent } from './offer/create-offer/create-offer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularMaterialModule } from './angular-material.module';
import { HeaderComponent } from './header/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfferListComponent } from './offer/offer-list/offer-list.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    CreateOfferComponent,
    HeaderComponent,
    OfferListComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync(),
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
