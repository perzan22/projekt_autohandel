import { Injectable } from "@angular/core";
import { Offer } from "./offer.model";
import { Subject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class OfferService {

    private offers: Offer[] = []
    private offersSubs = new Subject<{ offers: Offer[] }>

    constructor(private http: HttpClient, private router: Router) {}

    getOfferUpdateListener() {
        return this.offersSubs.asObservable();
    }

    addOffer(nazwa: string, marka: string, model: string, rok_produkcji: number, przebieg: number, spalanie: number, pojemnosc_silnika: number, rodzaj_paliwa: string, opis: string, cena: number) {
        
        const offerData = new FormData();
        offerData.append('nazwa', nazwa)
        offerData.append('marka', marka)
        offerData.append('model', model)
        offerData.append('rok_produkcji', rok_produkcji.toString())
        offerData.append('przebieg', przebieg.toString())
        offerData.append('spalanie', spalanie.toString())
        offerData.append('pojemnosc_silnika', pojemnosc_silnika.toString())
        offerData.append('rodzaj_paliwa', rodzaj_paliwa)
        offerData.append('opis', opis)
        offerData.append('cena', cena.toString())

        this.http.post<{message: string, offer: Offer}>('http://localhost:3000/api/offers', offerData).subscribe({
            next: (createdOffer) => {
                console.log(createdOffer.message)
                this.router.navigate(['/']) 
            },
            error: () => {
                console.log("Offer not created")
            }
        })
    }

    getOffers() {

        this.http.get<{ message: string, offers: any }>('http://localhost:3000/api/offers')
        .pipe(map(offerData => {
            return {
                offers: offerData.offers.map((offer: { _id: string; nazwa: string; marka: string; model: string; rok_produkcji: number; 
                    przebieg: number; spalanie: number; pojemnosc_silnika: number; rodzaj_paliwa: string; opis: string; cena: number}) => {
                    return {
                        id: offer._id,
                        nazwa: offer.nazwa, 
                        marka: offer.marka,
                        model: offer.model,
                        rok_produkcji: offer.rok_produkcji,
                        przebieg: offer.przebieg,
                        spalanie: offer.spalanie,
                        pojemnosc_silnika: offer.pojemnosc_silnika,
                        rodzaj_paliwa: offer.rodzaj_paliwa,
                        opis: offer.opis,
                        cena: offer.cena

                    }
                })
            }
        }))
        .subscribe({
            next: (fetchedOffers) => {
                this.offers = fetchedOffers.offers;
                this.offersSubs.next({ offers: [...this.offers] });
            }
        })
    }

}