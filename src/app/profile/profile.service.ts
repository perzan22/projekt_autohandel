import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Profile } from "./profile.model";
import { map } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })
export class ProfileService {


    constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

    createProfile(imie: string, nazwisko: string, ulica: string, nrBudynku: string, nrMieszkania: string | null, miasto: string, nrTelefonu: string, avatar: File | null) {

        let adres = '';

        if (nrMieszkania) {
            adres = ulica + ' ' + nrBudynku + '/' + nrMieszkania
        } else {
            adres = ulica + ' ' + nrBudynku
        }

        const profileData = new FormData();
        profileData.append('imie', imie)
        profileData.append('nazwisko', nazwisko)
        profileData.append('adres', adres)
        profileData.append('miasto', miasto)
        profileData.append('nrTelefonu', nrTelefonu)
        if (avatar) {
            profileData.append('avatar', avatar, imie + nazwisko)
        }
        this.http.post<{ message: string, profile: Profile }>('http://localhost:3000/api/profiles', profileData).subscribe({
            next: createdProfile => {
                console.log(createdProfile)
                this.authService.setProfileID(createdProfile.profile.id)
                this.router.navigate(['/']) 
            }
        })
    }

    getProfile(profileID: string | null) {
        return this.http.get<{ _id: string, email: string, nickname: string, imie: string, nazwisko: string, adres: string, miasto: string, nrTelefonu: string, userID: string, avatarPath: string }>
        ('http://localhost:3000/api/profiles/' + profileID).pipe(map(profile => {
            return {
                id: profile._id,
                email: profile.email,
                nickname: profile.nickname,
                imie: profile.imie,
                nazwisko: profile.nazwisko,
                adres: profile.adres,
                adresMiasto: profile.miasto,
                nrTelefonu: profile.nrTelefonu,
                userID: profile.userID,
                ulubione: [],
                avatarPath: profile.avatarPath
            }
        }))
    }

    editProfile(profileID: string | null, imie: string, nazwisko: string, ulica: string, nrBudynku: string, nrMieszkania: string | null, miasto: string, nrTelefonu: string, avatar: File | null) {

        let adres = '';

        if (nrMieszkania) {
            adres = ulica + ' ' + nrBudynku + '/' + nrMieszkania
        } else {
            adres = ulica + ' ' + nrBudynku
        }

        const profileData = new FormData();
        if (profileID !== null) {
            profileData.append('id', profileID)
            profileData.append('imie', imie)
            profileData.append('nazwisko', nazwisko)
            profileData.append('adres', adres)
            profileData.append('miasto', miasto)
            profileData.append('nrTelefonu', nrTelefonu)
            if (avatar) {
                profileData.append('avatar', avatar, imie+nazwisko)
            }

            this.http.put('http://localhost:3000/api/profiles/' + profileID, profileData).subscribe(response => {
            this.router.navigate(['/profile/show/' + profileID])
            })
        }
        

        
    }

    getProfileByUserID(userID: string) {
        return this.http.get<{ _id: string, email: string, nickname: string, imie: string, nazwisko: string, adres: string, miasto: string, nrTelefonu: string, userID: string, avatarPath: string }>
        ('http://localhost:3000/api/profiles/user/' + userID).pipe(map(profile => {
            return {
                id: profile._id,
                email: profile.email,
                nickname: profile.nickname,
                imie: profile.imie,
                nazwisko: profile.nazwisko,
                adres: profile.adres,
                adresMiasto: profile.miasto,
                nrTelefonu: profile.nrTelefonu,
                userID: profile.userID,
                ulubione: [],
                avatarPath: profile.avatarPath
            }
        }))
    }

    addToFavorites(offerID: string) {
        return this.http.post('http://localhost:3000/api/profiles/favorites/add', { offerID })
    }

    removeFromFavorites(offerID: string) {
        return this.http.post('http://localhost:3000/api/profiles/favorites/remove', { offerID })
    }
}