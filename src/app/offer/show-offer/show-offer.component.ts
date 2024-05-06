import { Component, OnDestroy, OnInit } from '@angular/core';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-offer',
  templateUrl: './show-offer.component.html',
  styleUrl: './show-offer.component.sass'
})
export class ShowOfferComponent implements OnInit, OnDestroy{

  offer!: Offer
  userID!: string
  isAuth: boolean = false
  authStatusSubs!: Subscription

  constructor(private offerService: OfferService, private route: ActivatedRoute, private authService: AuthService, private router: Router) {}
  

  ngOnInit(): void {
    this.offerService.getOffer(this.route.snapshot.params['offerID']).subscribe({
      next: offer => {
        this.offer = offer
      }
    })

    this.userID = this.authService.getUserId();
    this.isAuth = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe({
      next: isAuthenticated => {
        this.isAuth = isAuthenticated.isAuth
        this.userID = this.authService.getUserId();
      }
    })
  }

  onDelete(offerID: string) {
    this.offerService.deleteOffer(offerID).subscribe({
      next: () => {
        this.router.navigate(['/']);
      }
    })
  }

  onEdit(offerID: string) {
      
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }
}
