import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferListComponent } from './offer/offer-list/offer-list.component';
import { CreateOfferComponent } from './offer/create-offer/create-offer.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { ShowOfferComponent } from './offer/show-offer/show-offer.component';

const routes: Routes = [
  { path: '', component: OfferListComponent },
  { path: 'create', component: CreateOfferComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'offer/:offerID', component: ShowOfferComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
