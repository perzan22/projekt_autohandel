import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'Autohandel Bojano';

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {

    this.authService.autoAuth();

  }
}
