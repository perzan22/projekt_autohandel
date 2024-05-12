import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class HasProfileGuard implements CanActivate {

    constructor (private authService: AuthService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
        ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const hasProfile = this.authService.getProfileID().length > 0;
        if (!hasProfile) {
            this.router.navigate(['/profile/create']);
        }
        return hasProfile;
    }

}