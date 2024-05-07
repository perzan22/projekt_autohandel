import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ProfileService {

    constructor(private http: HttpClient, private router: Router) {}

    createProfile(imie: string, nazwisko: string, ulica: string, nrBudynku: string, nrMieszkania: string | null, miasto: string, nrTelefonu: string) {

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
    
        this.http.post('http://localhost:3000/api/profiles', profileData).subscribe({
            next: () => {
                this.router.navigate(['/']) 
            }
        })
    }
}