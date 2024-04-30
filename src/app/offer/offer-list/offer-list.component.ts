import { Component, OnDestroy, OnInit } from '@angular/core';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.sass'
})
export class OfferListComponent implements OnInit, OnDestroy{


  offers: Offer[] = []
  private offerSubs!: Subscription

  constructor(private offerService: OfferService) {}


  ngOnInit(): void {
    this.offerService.getOffers();
    this.offerSubs = this.offerService.getOfferUpdateListener().subscribe({
      next: offerData => {
        this.offers = offerData.offers
      }
    })

    console.log(this.offers)
  }

  ngOnDestroy(): void {
    this.offerSubs.unsubscribe()
  }


  
}
