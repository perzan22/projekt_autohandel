import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.sass'
})
export class CreateOfferComponent implements OnInit{

  form!: FormGroup
  offer!: Offer

  rodzaj_paliw = [
    { value: 'Benzyna'},
    { value: 'Diesel'},
    { value: 'Gaz'},
    { value: 'Prąd elektryczny' },
    { value: 'Hybrydowe'}
  ]

  constructor(private offerService: OfferService) {}

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
      })
    })
  }


  onPublishOffer() {

    if (this.form.invalid) {
      return
    }

    this.offerService.addOffer(this.form.value.nazwa, this.form.value.marka, this.form.value.model, this.form.value.rok_produkcji, this.form.value.przebieg, this.form.value.spalanie, 
    this.form.value.pojemnosc_silnika, this.form.value.rodzaj_paliwa, this.form.value.opis, this.form.value.cena);


  }
  
}
