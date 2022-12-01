import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Ability, AbilityBuilder } from '@casl/ability';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = environment.BASE_URL;
  menuList: Array<any> = [];

  constructor(
    private router: Router, 
    private http: HttpClient,
    private ability: Ability) { }

  getUserToken() {
    const sessionStorageToken: any = 
      sessionStorage.getItem('a-token') ? sessionStorage.getItem('a-token')
      : sessionStorage.getItem('h-token') ? sessionStorage.getItem('h-token') 
      : sessionStorage.getItem('mv-token');
    if (sessionStorageToken !== null) {
      return sessionStorageToken;
    } else {
      return sessionStorageToken;
    }
  }

  isLoggedIn() {
    const sessionStorageToken: any = sessionStorage.getItem('a-token')
      ? sessionStorage.getItem('a-token')
      : sessionStorage.getItem('h-token') ? sessionStorage.getItem('h-token') 
      : sessionStorage.getItem('mv-token');
    // this.getRole();
    if (sessionStorageToken !== null) {
      return !!sessionStorageToken;
    } else {
      return !!sessionStorageToken;
    }
  }
  
  getRole() {
    const token: any = sessionStorage.getItem('a-token')
      ? sessionStorage.getItem('a-token')
      : sessionStorage.getItem('h-token') ? sessionStorage.getItem('h-token') 
      : sessionStorage.getItem('mv-token') ? sessionStorage.getItem('mv-token') : '';
    // console.log('authservice', token);

    return JSON?.parse(atob(token?.split('.')[1]));
  }

  getLogedInUserDetails() {
    const userToken = this.getUserToken();
    return JSON?.parse(atob(userToken?.split('.')[1]));
  }
  
  onHospitalLogout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('h-token');
    sessionStorage.removeItem('user');

    sessionStorage.removeItem('h-token');
    sessionStorage.removeItem('hospital');
    sessionStorage.removeItem('kiosks');
    this.ability.update([]);
  }

  onAdminLogout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('a-token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('admin');
    this.ability.update([]);
  }

  onMvitalsLogout() {
    sessionStorage.removeItem('mv-token');
    sessionStorage.removeItem('mvitals');
    this.ability.update([]);
    this.router.navigate(['/mvitals/login']);
  }

  getHospitalById(id: any) {
    return this.http.get(this.baseUrl + 'hospital/getById/' + id);
  }

  mvitalLogin(data: any) {
    return this.http.post(this.baseUrl + 'master/mvitals-user/login', data);
  }

  saveMenuAccess(data: any) {
    this.menuList = data;
    console.log("saveMenuAccess ", this.menuList);
  }

  getMenuAccessByCurrentURL(currentUrl: string) {
    console.log("currentURL :: ", currentUrl);
    const isWriteAllowed = this.menuList.filter((menu: any) => {
      console.log("menu ", menu);
      if(!menu.hasSubMenu && menu.routerLink === currentUrl) {
        return true;
      } else if(menu.hasSubMenu) {
        const item = menu.children.filter((m: any) => m.routerLink == currentUrl)[0];
        if(item) {
          return true;
        }
      }
      return false;
    })[0].write;
    return isWriteAllowed;
    // return this.menuList;
  }

  private updateAbility(user: any) {
    const { can, rules } = new AbilityBuilder(Ability);

    if (user.role === 'admin') {
      can('manage', 'all');
    } else {
      can('read', 'all');
    }

    this.ability.update(rules);
  }

  ezerxLogin() {
    const payload = new FormData();

    payload.append("username", "ranjit.mohanty@moambulance.in");
    payload.append("pass", "ezecheck@2020");

    return this.http.post("https://api.ezecheck.in/login", payload);
  }

  ezerxPatientCreate(payload: any, token: string) {
    const headers = new HttpHeaders()
      .append('Authorization', 'Twjl2AAt5p2PQHIntnNU')
      .append('Token', token);
    return this.http.post("https://api.ezecheck.in/create", payload, { 
      headers: headers
    });
  }
  
  ezerxPatientReport(payload: any) {
    return this.http.post("https://api.ezecheck.in/patient", payload);
  }
}
