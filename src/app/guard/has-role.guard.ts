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
export class HasRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // console.log(this.authService.getRole().type);
    const role = this.authService.getRole().role;
    const type = this.authService.getRole().type;

    const isAuthorized: any =
      role == route?.data['role'][role - 1] && type == route.data['type'];
    // console.log(isAuthorized);

    const url =
        (role == 1 || role == 2) && type == 'admin'
        ? 'admin/dashboard'
        : (role == 1 || role == 2) && type == 'hospital'
        ? 'hospital/dashboard'
        : role == 3
        ? 'hospital/kiosk'
        : this.authService?.getRole()?.type;
    if (!isAuthorized) {
      return this.router.navigate([url]);
    }

    return true;
  }
}
