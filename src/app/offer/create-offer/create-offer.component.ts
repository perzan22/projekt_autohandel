import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.sass'
})
export class CreateOfferComponent implements OnInit{

  form!: FormGroup

  rodzaj_paliw = [
    { value: 'Benzyna'},
    { value: 'Diesel'},
    { value: 'Gaz'},
    { value: 'Prąd elektryczny' },
    { value: 'Hybrydowe'}
  ]

  ngOnInit(): void {
    this.form = new FormGroup({
      "nazwa": new FormControl(null, {
        validators: [Validators.required]
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


  
}
