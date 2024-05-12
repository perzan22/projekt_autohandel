import { Offer } from "../offer/offer.model";

export interface Profile {
    id: string
    email: string,
    nickname: string,
    imie: string,
    nazwisko: string,
    adres: string,
    adresMiasto: string,
    nrTelefonu: string,
    userID: string,
    ulubione: Offer[],
    avatarPath: string
}