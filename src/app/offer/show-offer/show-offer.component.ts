import { Component, OnInit } from '@angular/core';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-offer',
  templateUrl: './show-offer.component.html',
  styleUrl: './show-offer.component.sass'
})
export class ShowOfferComponent implements OnInit{
  
  offer!: Offer

  constructor(private offerService: OfferService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params['offerID'])
    this.offerService.getOffer(this.route.snapshot.params['offerID']).subscribe({
      next: offer => {
        this.offer = offer
      }
    })
  }
}
