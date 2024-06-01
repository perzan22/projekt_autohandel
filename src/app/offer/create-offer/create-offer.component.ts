import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeTypeMulti } from '../../validators/mime-type-multi.validator';
import { Car } from '../../car/car.model';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { CarService } from '../../car/car.service';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.sass'
})
export class CreateOfferComponent implements OnInit, OnDestroy{

  form!: FormGroup
  offer!: Offer
  mode: string = 'create'
  offerID: string | null = null
  imgURLs: string[] = []
  showButton: boolean = true
  cars: Car[] = []
  filteredBrands!: Observable<string[]> | undefined
  filteredModels!: Observable<string[]> | undefined
  private carSubs!: Subscription
  images: File[] = []

  isImageOverlayOpen: boolean = false
  selectedImage: string | null = null


  rodzaj_paliw = [
    { value: 'Benzyna'},
    { value: 'Diesel'},
    { value: 'Gaz'},
    { value: 'Prąd elektryczny' },
    { value: 'Hybrydowe'}
  ]

  constructor(private offerService: OfferService, public route: ActivatedRoute, private carService: CarService) {}


  

  ngOnInit(): void {
    this.form = new FormGroup({
      "nazwa": new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(40)]
      }),
      "marka": new FormControl(null, {
        validators: [Validators.required]
      }),
      "model": new FormControl(null, {
        validators: [Validators.required]
      }),
      "rok_produkcji": new FormControl(null, {
        validators: [Validators.required, Validators.min(1900), Validators.max(2024)]
      }),
      "przebieg": new FormControl(null, {
        validators: [Validators.required]
      }),
      "spalanie": new FormControl(null, {
        validators: [Validators.required]
      }),
      "pojemnosc_silnika": new FormControl(null, {
        validators: [Validators.required]
      }),
      "rodzaj_paliwa": new FormControl(null, {
        validators: [Validators.required]
      }),
      "opis": new FormControl(null),
      "cena": new FormControl(null, {
        validators: [Validators.required]
      }),
      'images': new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeTypeMulti]
      }

      )
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('offerID')) {
        this.mode = 'edit';
        this.offerID = paramMap.get('offerID');
        this.offerService.getOffer(this.offerID).subscribe(offerData => {
          this.offer = {id: offerData.id, nazwa: offerData.nazwa, marka: offerData.marka,
                          model: offerData.model, rok_produkcji: offerData.rok_produkcji, przebieg: offerData.przebieg, 
                          spalanie: offerData.spalanie, pojemnosc_silnika: offerData.pojemnosc_silnika, rodzaj_paliwa: offerData.rodzaj_paliwa, opis: offerData.opis, 
                          cena: offerData.cena, creator: offerData.creator, imagePath: offerData.imagePath, date: offerData.date, czyUlubione: false};
          if (this.offer.imagePath) {
             this.onImagePickedFromPath(this.offer.imagePath);
          } 
          this.form.setValue({'nazwa': this.offer.nazwa, 'marka': this.offer.marka, 'model': this.offer.model, 'rok_produkcji': this.offer.rok_produkcji, 'przebieg': this.offer.przebieg,
            'spalanie': this.offer.spalanie, 'pojemnosc_silnika': this.offer.pojemnosc_silnika, 'rodzaj_paliwa': offerData.rodzaj_paliwa, 'opis': offerData.opis, 'cena': offerData.cena,
            'images': this.offer.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.offerID = null;
      }
    });

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

  }

  ngOnDestroy(): void {
    this.carSubs.unsubscribe()
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

  onPublishOffer() {

    if (this.form.invalid) {
      return
    }

    if (this.mode === 'create') {
      this.offerService.addOffer(this.form.value.nazwa, this.form.value.marka, this.form.value.model, this.form.value.rok_produkcji, this.form.value.przebieg, this.form.value.spalanie, 
      this.form.value.pojemnosc_silnika, this.form.value.rodzaj_paliwa, this.form.value.opis, this.form.value.cena, this.form.value.images);
    } else {
      this.offerService.editOffer(this.offerID, this.form.value.nazwa, this.form.value.marka, this.form.value.model, this.form.value.rok_produkcji, this.form.value.przebieg, this.form.value.spalanie, 
      this.form.value.pojemnosc_silnika, this.form.value.rodzaj_paliwa, this.form.value.opis, this.form.value.cena);
    }
    


  }

  onImagePicked(event: Event) {
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement || !inputElement.files || !this.form || inputElement.files.length === 0) {
      return;
    }
    
    const files = Array.from(inputElement.files);
    if (files.length + this.imgURLs.length > 6) {
      alert('Możesz opublikować maksymalnie 6 zdjęć!')
      return
    }

    

    files.forEach(file => {
      this.images.push(file)
      const reader = new FileReader();
      reader.onload = () => {
        this.imgURLs.push(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      })

    this.form.patchValue({ images: this.images });
    this.form.get('images')?.updateValueAndValidity();

    console.log(this.form.value.images);
  }

  updateImagePreviews(): void {
    this.imgURLs = [];
    this.images.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imgURLs.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  onHideButton() {
    this.showButton = false;
  }

  onImagePickedFromPath(paths: string[]) {
    this.imgURLs = paths;
    this.form.get('images')?.updateValueAndValidity();
  }

  removeImage(index: number): void {
    this.images.splice(index, 1)
    this.updateImagePreviews()
    this.form.patchValue({ images: this.images })
    this.form.get('images')?.updateValueAndValidity()
  }

  openImageOverlay(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.isImageOverlayOpen = true;
  }

  closeImageOverlay() {
    this.isImageOverlayOpen = false;
  }
  
}
