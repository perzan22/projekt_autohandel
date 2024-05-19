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

    addOffer(nazwa: string, marka: string, model: string, rok_produkcji: number, przebieg: number, spalanie: number, pojemnosc_silnika: number, rodzaj_paliwa: string, opis: string, cena: number, image: File | null) {
        
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

        if (image) {
            offerData.append('image', image, nazwa)
        }

        this.http.post<{message: string, offer: Offer}>('http://localhost:3000/api/offers', offerData).subscribe({
            next: (createdOffer) => {
                console.log(createdOffer.message)
                this.router.navigate(['/']) 
            },
            error: (error) => {
                console.log(error.messasge)
            }
        })
    }

    getOffers() {

        this.http.get<{ message: string, offers: any }>('http://localhost:3000/api/offers')
        .pipe(map(offerData => {
            return {
                offers: offerData.offers.map((offer: { _id: string; nazwa: string; marka: string; model: string; rok_produkcji: number; 
                    przebieg: number; spalanie: number; pojemnosc_silnika: number; rodzaj_paliwa: string; opis: string; cena: number; creator: string; imagePath: string; date: Date}) => {
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
                        cena: offer.cena,
                        creator: offer.creator,
                        imagePath: offer.imagePath,
                        date: offer.date
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

    getOffer(offerID: string | null) {
        return this.http.get<{_id: string, nazwa: string, marka: string, model: string, rok_produkcji: number, przebieg: number,
        spalanie: number, pojemnosc_silnika: number, rodzaj_paliwa: string, opis: string, cena: number, creator: string, imagePath: string, date: Date }>('http://localhost:3000/api/offers/' + offerID)
        .pipe(map(offer => {
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
                cena: offer.cena,
                creator: offer.creator,
                imagePath: offer.imagePath,
                date: offer.date
            }
        }))
    }

    deleteOffer(offerID: string) {
        return this.http.delete('http://localhost:3000/api/offers/' + offerID)
    }

    editOffer(id: string | null, nazwa: string, marka: string, model: string, rok_produkcji: number, przebieg: number, spalanie: number, pojemnosc_silnika: number, rodzaj_paliwa: string, opis: string, cena: number) {
        const offerData = new FormData();
        if (id !== null) {
            offerData.append('id', id)
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


            this.http.put('http://localhost:3000/api/offers/' + id, offerData)
            .subscribe(response => {
                this.router.navigate(['/'])
            })
        }
    }

    getOffersSerching(marka: string | null, model: string | null, cenaMin: number | null, cenaMax: number | null, rokProdukcjiMin: number | null, rokProdukcjiMax: number | null, przebiegMax: number | null, rodzajPaliwa: string | null) {
        let baseUrl = 'http://localhost:3000/api/offers/search';
        let url = new URL(baseUrl);

        if (marka) {
            url.searchParams.append('marka', marka);
            if (model) {
                url.searchParams.append('model', model);
            }
        }
        if (cenaMin) {
            url.searchParams.append('cena_min', cenaMin.toString());
        }
        if (cenaMax) {
            url.searchParams.append('cena_max', cenaMax.toString());
        }
        if (rokProdukcjiMin) {
            url.searchParams.append('rok_produkcji_min', rokProdukcjiMin.toString());
        }
        if (rokProdukcjiMax) {
            url.searchParams.append('rok_produkcji_max', rokProdukcjiMax.toString());
        }
        if (przebiegMax) {
            url.searchParams.append('przebieg_max', przebiegMax.toString());
        }
        if (rodzajPaliwa) {
            url.searchParams.append('rodzaj_paliwa', rodzajPaliwa);
        }

        this.http.get<{ message: string, offers: any }>(url.toString())
        .pipe(map(offerData => {
            return {
                offers: offerData.offers.map((offer: { _id: string; nazwa: string; marka: string; model: string; rok_produkcji: number; 
                    przebieg: number; spalanie: number; pojemnosc_silnika: number; rodzaj_paliwa: string; opis: string; cena: number; creator: string; imagePath: string; date: Date}) => {
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
                        cena: offer.cena,
                        creator: offer.creator,
                        imagePath: offer.imagePath,
                        date: offer.date
                    }
                })
            }
        }))
        .subscribe({
            next: (fetchedOffers) => {
                this.offers = fetchedOffers.offers;
                this.offersSubs.next({ offers: [...this.offers] });
            }, 
            error: error => {
                console.log(error)
            }
        })
    }
}
