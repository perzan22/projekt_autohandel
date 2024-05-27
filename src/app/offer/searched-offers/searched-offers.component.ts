import { Component, OnDestroy, OnInit, ViewChild, afterNextRender } from '@angular/core';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Car } from '../../car/car.model';
import { CarService } from '../../car/car.service';
import { __values } from 'tslib';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../../profile/profile.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'searched-offers',
  templateUrl: './searched-offers.component.html',
  styleUrl: './searched-offers.component.sass'
})
export class SearchedOffersComponent implements OnInit, OnDestroy{

  form!: FormGroup
  offers: Offer[] = []
  private offerSubs!: Subscription
  mode: string = 'search'
  cars: Car[] = []
  filteredBrands!: Observable<string[]> | undefined
  filteredModels!: Observable<string[]> | undefined
  private carSubs!: Subscription
  userID!: string
  private authSubs!: Subscription
  isAuth: boolean = false

  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15];

  pageEvent!: PageEvent

  rodzaj_paliw = [
    { value: 'Benzyna'},
    { value: 'Diesel'},
    { value: 'Gaz'},
    { value: 'Prąd elektryczny' },
    { value: 'Hybrydowe'}
  ]

  sortowanie = [
    { name: 'Cena (rosnąco)', value: 'cenaAsc' },
    { name: 'Cena (malejąco)', value: 'cenaDesc' },
    { name: 'Rok produkcji (rosnąco)', value: 'rokProdukcjiAsc' },
    { name: 'Rok produkcji (malejąco)', value: 'cenaDesc' },
    { name: 'Przebieg (rosnąco)', value: 'przebiegAsc' },
    { name: 'Przebieg (malejąco)', value: 'przebiegDesc' },
    { name: 'Od najnowszych', value: 'dateAsc' },
    { name: 'Od najstarszych', value: 'dateDesc' }
  ]

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private offerService: OfferService, private router: Router, private route: ActivatedRoute, private carService: CarService, private authService: AuthService, private profileService: ProfileService) {}


  ngOnInit(): void {

    this.paginator._intl.itemsPerPageLabel = 'Ilośc ofert na stronie:'
    this.isAuth = this.authService.getIsAuth();
    if (this.isAuth) {
      this.userID = this.authService.getUserId();
    }
    this.authSubs = this.authService.getAuthStatusListener().subscribe({
      next: user => {
        this.isAuth = user.isAuth
        if (this.isAuth) {
          this.userID = this.authService.getUserId();
        }
      }
    })

    this.route.url.subscribe({
      next: url => {
        console.log(url[0].path)
        if (url[0].path === 'search') {

          this.mode = 'search'
          this.form = new FormGroup({
            "marka": new FormControl(null),
            "model": new FormControl(null),
            "cenaMin": new FormControl(null),
            "cenaMax": new FormControl(null),
            "rokProdukcjiMin": new FormControl(null),
            "rokProdukcjiMax": new FormControl(null),
            "przebiegMax": new FormControl(null),
            "rodzajPaliwa": new FormControl(null),
            "sortowanie": new FormControl(null)
          })
      
          this.route.queryParams.subscribe({
            next: params => {
              if (params['marka']) {
                this.form.patchValue({'marka': params['marka']})
              }
              if (params['model']) {
                this.form.patchValue({'model': params['model']})
              }
              if (params['cena_min']) {
                this.form.patchValue({'cenaMin': params['cena_min']})
              }
              if (params['cena_max']) {
                this.form.patchValue({'cenaMax': params['cena_max']})
              }
              if (params['rok_produkcji_min']) {
                this.form.patchValue({'rokProdukcjiMin': params['rok_produkcji_min']})
              }
              if (params['rok_produkcji_max']) {
                this.form.patchValue({'rokProdukcjiMax': params['rok_produkcji_max']})
              }
              if (params['przebieg_max']) {
                this.form.patchValue({'przebiegMax': params['przebieg_max']})
              }
              if (params['rodzaj_paliwa']) {
                this.form.patchValue({'rodzajPaliwa': params['rodzaj_paliwa']})
              }
              if (params['sortowanie']) {
                this.form.patchValue({'sortowanie': params['sortowanie']})
              }
            }
          })
          
          this.offerService.getOffersSerching(this.router.url);
          this.offerSubs = this.offerService.getOfferUpdateListener().subscribe({
            next: offerData => {
              this.offers = offerData.offers
              this.length = offerData.maxOffers
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
      
        } else if (url[0].path === 'my-offers') {
          this.mode = 'my-offers'
          this.offerService.getUserOffers(this.userID);
          this.offerSubs = this.offerService.getOfferUpdateListener().subscribe({
            next: offerData => {
              this.offers = offerData.offers
            }
          })
        } else {
          this.mode = 'favorites';
          this.offerService.getFavoritesOffers(this.userID);
          this.offerSubs = this.offerService.getOfferUpdateListener().subscribe({
            next: offerData => {
              this.offers = offerData.offers
            }
          })
        }
      }
    })

    
  }



  ngOnDestroy(): void {
    this.offerSubs.unsubscribe();
    this.authSubs.unsubscribe();

    if (this.mode === 'search') {
      this.carSubs.unsubscribe();
    }
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
    
    this.router.navigate([], { relativeTo: this.route, queryParams: { marka: this.form.value.marka, model: this.form.value.model, cena_min: this.form.value.cenaMin, cena_max: this.form.value.cenaMax,
      rok_produkcji_min: this.form.value.rokProdukcjiMin, rok_produkcji_max: this.form.value.rokProdukcjiMax, przebieg_max: this.form.value.przebiegMax, rodzaj_paliwa: this.form.value.rodzajPaliwa, sortowanie: this.form.value.sortowanie
   },  replaceUrl: true } )

   window.location.reload()
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

  pageChanged(e: PageEvent) {
    this.pageEvent = e
    this.pageSize = e.pageSize
    this.pageIndex = e.pageIndex + 1

    this.router.navigate([], { queryParams: { marka: this.form.value.marka, model: this.form.value.model, cena_min: this.form.value.cenaMin, cena_max: this.form.value.cenaMax,
      rok_produkcji_min: this.form.value.rokProdukcjiMin, rok_produkcji_max: this.form.value.rokProdukcjiMax, przebieg_max: this.form.value.przebiegMax, rodzaj_paliwa: this.form.value.rodzajPaliwa, sortowanie: this.form.value.sortowanie,
      pagesize: this.pageSize, pageindex: this.pageIndex }
    })
    .then(() => {
      this.ngOnInit()
    })
  }
}