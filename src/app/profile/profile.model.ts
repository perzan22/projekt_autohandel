import { Offer } from "../offer/offer.model";

export interface Profile {
    email: string,
    imie: string,
    nazwisko: string,
    adresUlica: string,
    adresNrBudynku: string,
    adresNrMieszkania: string,
    adresMiasto: string,
    nrTelefonu: string,
    userID: string,
    ulubione: Offer[]
}