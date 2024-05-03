import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {


  constructor(private authService: AuthService) {}

  onLogin(form: NgForm) {

    if(form.invalid) {
      return;
    }

    this.authService.login(form.value.email, form.value.password);
  }

}
