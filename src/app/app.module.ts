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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ShowOfferComponent } from './offer/show-offer/show-offer.component';
import { ValidateEqualModule } from 'ng-validate-equal';
import { CreateProfileComponent } from './profile/create-profile/create-profile.component';
import { ShowProfileComponent } from './profile/show-profile/show-profile.component';
import { SearchedOffersComponent } from './offer/searched-offers/searched-offers.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatComponent } from './chat/chat/chat.component';
import { ChatListComponent } from './chat/chat-list/chat-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostCreateComponent } from './forum/post-create/post-create.component';
import { PostListComponent } from './forum/post-list/post-list.component';
import { CommentCreateComponent } from './forum/comment-create/comment-create.component';

const config: SocketIoConfig = { url:"http://localhost:3000", options: {} }

@NgModule({
  declarations: [
    AppComponent,
    CreateOfferComponent,
    HeaderComponent,
    OfferListComponent,
    LoginComponent,
    SignupComponent,
    ShowOfferComponent,
    CreateProfileComponent,
    ShowProfileComponent,
    SearchedOffersComponent,
    ChatComponent,
    ChatListComponent,
    PostCreateComponent,
    PostListComponent,
    CommentCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ValidateEqualModule,
    SocketIoModule.forRoot(config),
    InfiniteScrollModule
  ],
  providers: [
    provideAnimationsAsync(),
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
