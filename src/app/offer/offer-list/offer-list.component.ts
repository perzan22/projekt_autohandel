import { Component, OnDestroy, OnInit } from '@angular/core';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Car } from '../../car/car.model';
import { CarService } from '../../car/car.service';

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

  rodzaj_paliw = [
    { value: 'Benzyna'},
    { value: 'Diesel'},
    { value: 'Gaz'},
    { value: 'Prąd elektryczny' },
    { value: 'Hybrydowe'}
  ]

  constructor(private offerService: OfferService, private router: Router, private route: ActivatedRoute, private carService: CarService) {}


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
    

    this.route.paramMap.subscribe({
      next: (paramMap: ParamMap) => {
        if (paramMap.has("searchParam")) {
          this.mode = 'search'
        } else {
          this.mode = 'main'
          this.offerService.getOffers();
          this.offerSubs = this.offerService.getOfferUpdateListener().subscribe({
            next: offerData => {
              this.offers = offerData.offers
            }
          })
        }
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
    this.offerSubs.unsubscribe()
    this.carSubs.unsubscribe()
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

    this.offerService.getOffersSerching(this.form.value.marka, this.form.value.model, this.form.value.cenaMin,
       this.form.value.cenaMax, this.form.value.rokProdukcjiMin, this.form.value.rokProdukcjiMax, this.form.value.przebiegMax, this.form.value.rodzajPaliwa)
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
  
}
