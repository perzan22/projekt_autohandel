import { Component, OnDestroy, OnInit } from '@angular/core';
import { Offer } from '../offer.model';
import { OfferService } from '../offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { Profile } from '../../profile/profile.model';
import { ChatService } from '../../chat/chat.service';

@Component({
  selector: 'app-show-offer',
  templateUrl: './show-offer.component.html',
  styleUrl: './show-offer.component.sass'
})
export class ShowOfferComponent implements OnInit, OnDestroy{

  offer!: Offer
  userID!: string
  isAuth: boolean = false
  authStatusSubs!: Subscription
  profile!: Profile
  showPhone: boolean = false

  constructor(private offerService: OfferService, private route: ActivatedRoute, private authService: AuthService, private router: Router, private profileService: ProfileService, private chatService: ChatService) {}
  

  ngOnInit(): void {
    this.offerService.getOffer(this.route.snapshot.params['offerID']).subscribe({
      next: offer => {
        this.offer = offer
        console.log(this.offer)
        this.isAuth = this.authService.getIsAuth();
        if (this.isAuth) {
            this.userID = this.authService.getUserId();
        }
        this.authStatusSubs = this.authService.getAuthStatusListener().subscribe({
          next: isAuthenticated => {
              this.isAuth = isAuthenticated.isAuth
              if (this.isAuth) {
              this.userID = this.authService.getUserId();
            }
          }
        })
        if (this.isAuth) {
          this.profileService.getProfileByUserID(this.offer.creator).subscribe({
            next: profileData => {
              this.profile = profileData
            }
          })
        }
        
      }
    })
  }

  onDelete(offerID: string) {
    this.offerService.deleteOffer(offerID).subscribe({
      next: () => {
        this.router.navigate(['/']);
      }
    })
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }

  onShowPhone() {
    this.showPhone = true;
  }

  onAddToFavorites(event: Event, offerID: string) {
    event.stopPropagation();
    this.profileService.addToFavorites(offerID);
    this.toggleFavoriteStatus(true)
  }

  onRemoveFromFavorites(event: Event, offerID: string) {
    event.stopPropagation();
    this.profileService.removeFromFavorites(offerID);
    this.toggleFavoriteStatus(false)
  }

  private toggleFavoriteStatus(status: boolean) {
    const offer = this.offer
    if (offer) {
      offer.czyUlubione = status;
    }
  }

  onChat() {
    this.chatService.openChat(this.offer.creator, this.userID, this.offer.id);
  }
}
