import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferListComponent } from './offer/offer-list/offer-list.component';
import { CreateOfferComponent } from './offer/create-offer/create-offer.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path: '', component: OfferListComponent },
  { path: 'create', component: CreateOfferComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
