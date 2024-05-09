import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent{

  error: string = ''
  mode: string = 'signup'

  constructor(private authService: AuthService) {}

  
  onSignup(form: NgForm) {
    if(form.invalid) {
      return
    }
    this.authService.createUser(form.value.email, form.value.password, form.value.nickname)
    this.error = this.authService.getError()
  }

}
