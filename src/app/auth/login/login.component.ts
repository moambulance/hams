import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { HospitalService } from 'src/app/modules/hospital/hospital.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isBtnLoading: any = null;
  hospitalLoginForm!: FormGroup;
  roleConformForm: any;
  fieldTextType!: boolean;
  success: boolean = true;
  ROUTER_URL: boolean = false;
  // displayNone: string = '';

  // failed: boolean = false;
  message: any;
  responseMessage: any = '';
  currentRoute: string;
  event: any;

  constructor(
    private formBuilder: FormBuilder,
    // private toaster: ToastrService,
    private router: Router,
    private hospitalService: HospitalService,
    private authService: AuthService,
    private adminService: AdminService,
    private el: ElementRef,
  ) {
    this.currentRoute = '';

    this.hospitalLoginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.event = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // console.log('Route change detected', this.router.url);
      }

      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (this.router.url.includes('login')) {
          window.location.reload();
        }
        // console.log(event);
      }
    });

    // console.log("this.router.url ", this.router.url);

    if (this.router.url == '/admin/login') {
      // this.ROUTER_URL = true;
      const el: any = document.querySelector('.vertical-align-middle');
      // console.log('el', el);
      el.classList.remove('auth-main');
      el.classList.add('auth-admin');

      // console.log('admin', el.className);
    } else {
      const el: any = document.querySelector('.vertical-align-middle');
      el.classList.add('auth-main');
      el.classList.remove('auth-admin');

      // console.log('login', el.className);
    }
    if (this.authService.isLoggedIn())
      if (this.router.url === '/login') {
        this.router.navigate(['/hospital/dashboard']);
      } else if (this.router.url === '/admin/login') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate([this.router.url]);
      }
  }

  onLogin() {
    this.isBtnLoading = true;
    const loginInputs = {
      username: this.hospitalLoginForm.value['username'],
      password: this.hospitalLoginForm.value['password'],
    };
    if (this.router.url === '/login') {
      this.hospitalService.loginHospital(loginInputs).subscribe(
        (response: any) => {
          this.success = response.success;
          if (!response.success) {
            this.responseMessage = 'Username And Passowrd are Invalid';

            this.isBtnLoading = false;

            this.success = false;
            this.message = response.message;
            this.router.navigate(['/login']);
          } else if (response.success) {
            let user: any = JSON?.parse(atob(response.token?.split('.')[1]));
            // console.log("user.role ", user.role);
            if (user.role === 3) {
              this.isBtnLoading = false;
              this.success = true;
              this.message = response.message;
              this.router.navigate(['hospital/kiosk']);
              sessionStorage?.setItem('h-token', response.token);
              sessionStorage?.setItem('kiosks', JSON.stringify(user));
            } else {
              this.isBtnLoading = false;
              console.log('user');
              this.success = true;
              this.message = response.message;
              this.router.navigate(['/hospital/dashboard']);
              sessionStorage?.setItem('h-token', response.token);
              sessionStorage?.setItem('hospital', JSON.stringify(user));
            }
          }
        },
        (error: any) => {
          this.isBtnLoading = false;
        },
      );
    } else if (this.router.url === '/admin/login') {
      this.adminService.loginAdmin(loginInputs).subscribe(
        (response: any) => {
          if (!response.success) {
            this.responseMessage = 'Username And Passowrd are Invalid';
            this.isBtnLoading = false;
            this.success = false;
            this.message = response.message;
            this.router.navigate(['/admin/login']);
          } else {
            let user: any = JSON?.parse(atob(response.token?.split('.')[1]));
            console.log("user ", user);
            this.isBtnLoading = false;
            this.success = true;
            this.message = response.message;
            this.router.navigate(['/admin/dashboard']);
            sessionStorage?.setItem('a-token', response.token);
            sessionStorage?.setItem('admin', JSON.stringify(user));
          }
        },
        (error: any) => {
          console.log("error in login to mvitals ", error);
        }
      );
    } else if(this.router.url === '/mvitals/login'){
      this.authService.mvitalLogin(loginInputs).subscribe((response: any) => {
        this.isBtnLoading = false;
        if (!response.success) {
          this.success = false;
          this.responseMessage = response.message;//'Username And Passowrd are Invalid';
          this.message = response.message;
          this.router.navigate(['/mvitals/login']);
        } else {
          let user: any = JSON?.parse(atob(response.token?.split('.')[1]));
          this.success = true;
          this.message = response.message;
          if(response.data.is_mhu === 1){
            this.router.navigate(['/mhu-dashboard']);
          } else {
            this.router.navigate(['/mvitals-dashboard']);
          }
          sessionStorage?.setItem('mv-token', response.token);
          sessionStorage?.setItem('mvitals', JSON.stringify(user));
        }
      }, (error: any) => {
        this.isBtnLoading = false;
      });
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  get username() {
    return this.hospitalLoginForm.get('username');
  }

  get password() {
    return this.hospitalLoginForm.get('password');
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  onClose() {
    this.responseMessage = '';
  }
}
