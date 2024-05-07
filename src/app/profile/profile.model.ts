import { Offer } from "../offer/offer.model";

export interface Profile {
    email: string,
    nickname: string,
    imie: string,
    nazwisko: string,
    adres: string,
    adresMiasto: string,
    nrTelefonu: string,
    userID: string,
    ulubione: Offer[]
}