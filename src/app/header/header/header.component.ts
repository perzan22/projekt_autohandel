import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {


  isAuthenticated: Boolean = false;
  nickname: string = '';
  profileID: string = ''
  private authSubs!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    if (this.isAuthenticated) {
      this.nickname = this.authService.getNickname();
      this.profileID = this.authService.getProfileID();
    }

    this.authSubs = this.authService.getAuthStatusListener().subscribe({
      next: authData => {
        this.isAuthenticated = authData.isAuth;
        if (this.isAuthenticated) {
          this.nickname = this.authService.getNickname();
          this.profileID = this.authService.getProfileID();
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
