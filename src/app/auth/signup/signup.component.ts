import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent implements OnInit{

  error: string = ''
  mode: string = 'signup'
  userID!: string | null

  constructor(private authService: AuthService, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userID')) {
        this.mode = 'edit';
        this.userID = paramMap.get('userID');
      } else {
        this.mode = 'signup';
        this.userID = null;
      }
    });
  }

  
  onSignup(form: NgForm) {
    if(form.invalid) {
      return
    }
    this.authService.createUser(form.value.email, form.value.password, form.value.nickname)
    this.error = this.authService.getError()
  }  

  onPasswordChange(form: NgForm) {
    if (form.invalid) {
      return
    }

    this.authService.changePassword(this.userID, form.value.oldPassword, form.value.password);
  }

}
