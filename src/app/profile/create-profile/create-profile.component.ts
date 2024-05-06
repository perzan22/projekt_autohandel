import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.sass'
})
export class CreateProfileComponent implements OnInit{
  

  form!: FormGroup
  email!: string
  userID!: string
  nickname!: string

  constructor(private authService: AuthService) {}


  ngOnInit(): void {
    this.form = new FormGroup({
      'imie': new FormControl(null, {
        validators: [Validators.required]
      }),
      'nazwisko': new FormControl(null, {
        validators: [Validators.required]
      }),
      'ulica': new FormControl(null, {
        validators: [Validators.required]
      }),
      'nrBudynku': new FormControl(null, {
        validators: [Validators.required, Validators.min(0)]
      }),
      'nrMieszkania': new FormControl(null, {
        validators: [Validators.min(0)]
      }),
      'miasto': new FormControl(null, {
        validators: [Validators.required]
      }),
      'nrTelefonu': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(9), Validators.maxLength(9)]
      })

    })

    this.nickname = this.authService.getNickname()
    this.userID = this.authService.getUserId()
    this.email = this.authService.getEmail()

  }
}
