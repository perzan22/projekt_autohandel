import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { Profile } from '../../profile/profile.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {

  profile!: Profile
  isAuthenticated: Boolean = false;
  nickname: string = '';
  profileID!: string;
  avatar: string = 'http://localhost:3000/images/avatars/default_avatar.jpg'
  private authSubs!: Subscription;

  constructor(private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    if (this.isAuthenticated) {
      this.nickname = this.authService.getNickname();
      this.profileID = this.authService.getProfileID();
      if(this.profileID) {
        this.profileService.getProfile(this.profileID).subscribe({
          next: profile => {
            this.avatar = profile.avatarPath
          }
        })
      }
      
    }
    this.authSubs = this.authService.getAuthStatusListener().subscribe({
      next: authData => {
        this.isAuthenticated = authData.isAuth;
        if (this.isAuthenticated) {
          this.nickname = this.authService.getNickname();
          this.profileID = this.authService.getProfileID();
          this.profileService.getProfile(this.profileID).subscribe({
            next: profile => {
              this.avatar = profile.avatarPath
            }
          })
        }
      }
    })
    console.log(this.avatar)
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
