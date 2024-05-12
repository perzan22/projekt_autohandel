import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../profile.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Profile } from '../profile.model';

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
  mode: string = 'create'
  profile!: Profile
  profileID!: string | null
  imgURL!: string
  constructor(private authService: AuthService, private profileService: ProfileService, private route: ActivatedRoute) {}


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
      }),
      'image': new FormControl(null)

      

    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('profileID')) {
        this.mode = 'edit';
        this.profileID = paramMap.get('profileID');
        this.profileService.getProfile(this.profileID).subscribe(profileData => {
          this.profile = {id: profileData.id, imie: profileData.imie, nazwisko: profileData.nazwisko,
                          adres: profileData.adres, adresMiasto: profileData.adresMiasto, nrTelefonu: profileData.nrTelefonu, 
                          userID: profileData.userID, email: profileData.email, nickname: profileData.nickname, ulubione: profileData.ulubione, 
                        };
          const adres = this.profile.adres.split(' ');
          const ulica = adres[0];
          const numery = adres[1].split('/');
          console.log(numery)
          if (numery.length > 1) {
            const nrBudynku = numery[0];
            const nrMieszkania = numery[1];
            this.form.setValue({'imie': this.profile.imie, 'nazwisko': this.profile.nazwisko, 'ulica': ulica, 'miasto': this.profile.adresMiasto, 'nrTelefonu': this.profile.nrTelefonu,
            'nrBudynku': nrBudynku, 'nrMieszkania': nrMieszkania
          });
          } else {
            const nrBudynku = numery[0];
            this.form.setValue({'imie': this.profile.imie, 'nazwisko': this.profile.nazwisko, 'ulica': ulica, 'miasto': this.profile.adresMiasto, 'nrTelefonu': this.profile.nrTelefonu,
            'nrBudynku': nrBudynku, 'nrMieszkania': null
          })
          
        }});
      } else {
        this.mode = 'create';
        this.profileID = null;
      }
    });

    this.nickname = this.authService.getNickname()
    this.email = this.authService.getEmail()
  }

  onSubmit() {
    if (this.form.invalid) {
      return
    }

    if (this.mode === 'create') {
      this.profileService.createProfile(this.form.value.imie, this.form.value.nazwisko, this.form.value.ulica, this.form.value.nrBudynku, this.form.value.nrMieszkania, this.form.value.miasto, this.form.value.nrTelefonu)
    } else {
      this.profileService.editProfile(this.profileID, this.form.value.imie, this.form.value.nazwisko, this.form.value.ulica, this.form.value.nrBudynku, this.form.value.nrMieszkania, this.form.value.miasto, this.form.value.nrTelefonu)
    }
    
  }

  onImagePicked(event: Event) {

  }
}
