import { Component, OnDestroy, OnInit } from '@angular/core';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Car } from '../../car/car.model';
import { CarService } from '../../car/car.service';
import { ProfileService } from '../../profile/profile.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.sass'
})
export class OfferListComponent implements OnInit, OnDestroy{

  form!: FormGroup
  offers: Offer[] = []
  private offerSubs!: Subscription
  mode: string = 'main'
  cars: Car[] = []
  filteredBrands!: Observable<string[]> | undefined
  filteredModels!: Observable<string[]> | undefined
  private carSubs!: Subscription
  isAuth: boolean = false
  private authSubs!: Subscription
  userID!: string

  rodzaj_paliw = [
    { value: 'Benzyna'},
    { value: 'Diesel'},
    { value: 'Gaz'},
    { value: 'Prąd elektryczny' },
    { value: 'Hybrydowe'}
  ]

  constructor(private offerService: OfferService, private router: Router, private route: ActivatedRoute, private carService: CarService, private profileService: ProfileService, private authService: AuthService) {}


  ngOnInit(): void {

    this.form = new FormGroup({
      "marka": new FormControl(null),
      "model": new FormControl(null),
      "cenaMin": new FormControl(null),
      "cenaMax": new FormControl(null),
      "rokProdukcjiMin": new FormControl(null),
      "rokProdukcjiMax": new FormControl(null),
      "przebiegMax": new FormControl(null),
      "rodzajPaliwa": new FormControl(null)
    })

    this.isAuth = this.authService.getIsAuth();
    if (this.isAuth) {
      this.userID = this.authService.getUserId();
    }
    this.authSubs = this.authService.getAuthStatusListener().subscribe({
      next: isAuth => {
        this.isAuth = isAuth.isAuth
        if (isAuth) {
          this.userID = this.authService.getUserId();
        }
      }
    })
    
    this.offerService.getOffers();
    this.offerSubs = this.offerService.getOfferUpdateListener().subscribe({
      next: offerData => {
        this.offers = offerData.offers
      }
    })

    this.carService.getCars()
    this.carSubs = this.carService.getCarUpdateListener().subscribe({
      next: carData => {
        this.cars = carData.cars
      }
    })

    this.filteredBrands = this.form.get('marka')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterBrands(value))
    )

    this.filteredModels = this.form.get('model')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterModels(value))
    )

    

    console.log(this.offers)
  }


  ngOnDestroy(): void {
    this.offerSubs.unsubscribe();
    this.carSubs.unsubscribe();
    this.authSubs.unsubscribe();
  }

  showOffer(offerID: string) {
    this.router.navigate(['/offer/' + offerID])
  }

  formatLabel(value: number): string {
    return value + 'zł'
  }

  onSearch() {
    if (this.form.invalid) {
      return
    }
    
    this.router.navigate(['search'], { queryParams: { marka: this.form.value.marka, model: this.form.value.model, cena_min: this.form.value.cenaMin, cena_max: this.form.value.cenaMax,
      rok_produkcji_min: this.form.value.rokProdukcjiMin, rok_produkcji_max: this.form.value.rokProdukcjiMax, przebieg_max: this.form.value.przebiegMax, rodzaj_paliwa: this.form.value.rodzajPaliwa
     } } )
  }

  private _filterBrands(value: string | { name: string }): string[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.cars
    .map(car => car.marka)
    .filter(brand => brand.toLowerCase().includes(filterValue))
    .filter((brand, index, self) => self.indexOf(brand) === index);
  }

  private _filterModels(value: string | { name: string }): string[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    let selectedBrand: string;
    if (this.form.get('marka')?.value) {
      selectedBrand = this.form.get('marka')?.value.toLowerCase();
    }
    
    return this.cars
    .filter(car => car.marka.toLowerCase() === selectedBrand)
    .map(car => car.model)
    .filter(model => model.toLowerCase().includes(filterValue))
    .filter((model, index, self) => self.indexOf(model) === index);
  }
  
  onAddToFavorites(event: Event, offerID: string) {
    event.stopPropagation();
    this.profileService.addToFavorites(offerID);
    this.toggleFavoriteStatus(offerID, true)
  }

  onRemoveFromFavorites(event: Event, offerID: string) {
    event.stopPropagation();
    this.profileService.removeFromFavorites(offerID);
    this.toggleFavoriteStatus(offerID, false)
  }

  private toggleFavoriteStatus(offerID: string, status: boolean) {
    const offer = this.offers.find(o => o.id === offerID)
    if (offer) {
      offer.czyUlubione = status;
    }
  }

}
