import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../../validators/mime-type.validator';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.sass'
})
export class CreateOfferComponent implements OnInit{

  form!: FormGroup
  offer!: Offer
  mode: string = 'create'
  offerID: string | null = null
  imgURL!: string
  showButton: boolean = true

  rodzaj_paliw = [
    { value: 'Benzyna'},
    { value: 'Diesel'},
    { value: 'Gaz'},
    { value: 'Prąd elektryczny' },
    { value: 'Hybrydowe'}
  ]

  constructor(private offerService: OfferService, public route: ActivatedRoute) {}

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
      'image': new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
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
                          cena: offerData.cena, creator: offerData.creator, imagePath: offerData.imagePath, date: offerData.date};
          if (this.offer.imagePath) {
            this.onImagePickedFromPath(this.offer.imagePath);
          } 
          this.form.setValue({'nazwa': this.offer.nazwa, 'marka': this.offer.marka, 'model': this.offer.model, 'rok_produkcji': this.offer.rok_produkcji, 'przebieg': this.offer.przebieg,
            'spalanie': this.offer.spalanie, 'pojemnosc_silnika': this.offer.pojemnosc_silnika, 'rodzaj_paliwa': offerData.rodzaj_paliwa, 'opis': offerData.opis, 'cena': offerData.cena,
            'image': this.offer.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.offerID = null;
      }
    });
  }


  onPublishOffer() {

    if (this.form.invalid) {
      return
    }

    if (this.mode === 'create') {
      this.offerService.addOffer(this.form.value.nazwa, this.form.value.marka, this.form.value.model, this.form.value.rok_produkcji, this.form.value.przebieg, this.form.value.spalanie, 
      this.form.value.pojemnosc_silnika, this.form.value.rodzaj_paliwa, this.form.value.opis, this.form.value.cena, this.form.value.image);
    } else {
      this.offerService.editOffer(this.offerID, this.form.value.nazwa, this.form.value.marka, this.form.value.model, this.form.value.rok_produkcji, this.form.value.przebieg, this.form.value.spalanie, 
      this.form.value.pojemnosc_silnika, this.form.value.rodzaj_paliwa, this.form.value.opis, this.form.value.cena);
    }
    


  }

  onImagePicked(event: Event) {
    console.log(event.target)
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement) {
      return;
    }
    const file = inputElement.files?.[0];
    if (!file) {
      return;
    }

    this.form.patchValue({image: file});
    if (!this.form) {
      return
    }
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgURL = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(this.form.value.image);
  }

  onHideButton() {
    this.showButton = false;
  }

  onImagePickedFromPath(avatar: string) {
    this.imgURL = avatar;
    this.form.get('image')?.updateValueAndValidity();
  }
  
}
