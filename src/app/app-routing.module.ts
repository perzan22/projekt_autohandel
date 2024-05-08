import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferListComponent } from './offer/offer-list/offer-list.component';
import { CreateOfferComponent } from './offer/create-offer/create-offer.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { HasProfileGuard } from './auth/guards/hasProfile.guard'
import { ShowOfferComponent } from './offer/show-offer/show-offer.component';
import { CreateProfileComponent } from './profile/create-profile/create-profile.component';

const routes: Routes = [
  { path: '', component: OfferListComponent },
  { path: 'create', component: CreateOfferComponent, canActivate: [AuthGuard, HasProfileGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'offer/:offerID', component: ShowOfferComponent },
  { path: 'edit/:offerID', component: CreateOfferComponent, canActivate: [AuthGuard] },
  { path: 'profile/create', component: CreateProfileComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, HasProfileGuard]
})
export class AppRoutingModule { }
