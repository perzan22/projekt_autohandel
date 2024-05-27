import { Offer } from "../offer/offer.model";

export interface Chat {
    id: string,
    buyer: string,
    seller: string,
    offer: Offer
}