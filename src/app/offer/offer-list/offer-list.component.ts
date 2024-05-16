import { Component, OnDestroy, OnInit } from '@angular/core';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.sass'
})
export class OfferListComponent implements OnInit, OnDestroy{


  offers: Offer[] = []
  private offerSubs!: Subscription
  mode: string = 'main'

  constructor(private offerService: OfferService, private router: Router, private route: ActivatedRoute) {}


  ngOnInit(): void {
    

    this.route.paramMap.subscribe({
      next: (paramMap: ParamMap) => {
        if (paramMap.has("searchParam")) {
          this.mode = 'search'
        } else {
          this.mode = 'main'
          this.offerService.getOffers();
          this.offerSubs = this.offerService.getOfferUpdateListener().subscribe({
            next: offerData => {
              this.offers = offerData.offers
      }
    })
        }
      }
    })

    console.log(this.offers)
  }

  ngOnDestroy(): void {
    this.offerSubs.unsubscribe()
  }

  showOffer(offerID: string) {
    this.router.navigate(['/offer/' + offerID])
  }
  
}
