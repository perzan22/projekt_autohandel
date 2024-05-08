import { Component, OnInit } from '@angular/core';
import { Profile } from '../profile.model';
import { ProfileService } from '../profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.sass'
})
export class ShowProfileComponent implements OnInit{

  profile!: Profile

  constructor(private profileService: ProfileService, private route: ActivatedRoute) {}


  ngOnInit(): void {
    
    this.profileService.getProfile(this.route.snapshot.params['profileID']).subscribe({
      next: profile => {
        this.profile = profile
      }
    })
  }


  
}
