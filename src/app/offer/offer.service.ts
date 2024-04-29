import { Injectable } from "@angular/core";
import { Offer } from "./offer.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OfferService {

    offer!: Offer

    private offerSubs = new Subject<{ offer: Offer }>

    getOfferUpdateListener() {
        return this.offerSubs.asObservable();
    }

    addOffer(offer: Offer) {
        this.offer = offer
        this.offerSubs.next({ offer: offer })
    }

}