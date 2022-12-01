import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {


    if (!this.authService.getUserToken()) {
      // console.log('true');
      const type = this.authService.getRole().type;
      // console.log("type ", type);
      if (type == 'mvitals') {
        this.router.navigate(['/mvitals/login']);
      } else {
        this.router.navigate(['login']);
      }
      return false;
    }
    const role = this.authService
      .getRole()
      .role
    const type = this.authService
      .getRole()
      .type
    // console.log("type ", type);
    if (role == 3 && type == 'hospital') {
      return this.router.navigate(['hospital/kiosks']);
    }
    if (role == 3 && type == 'hospital' && this.router.url !== 'hospital/kiosks') {
      return this.router.navigate(['hospital/kiosks']);
    }
    return true;
  }
}
