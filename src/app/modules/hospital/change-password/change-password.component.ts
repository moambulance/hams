import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
// import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Change Password',
    routing: [
      {
        routerHeading: 'change-password',
        routerLink: '/hospital/change-password',
      },
    ],
  };
  loaderSpin!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toaster: ToastrService,
  ) {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }
  encryptedPassword: any = '';
  changePasswordForm: any;
  encryptedConformPassword: any = '';
  encryptedNewPassword: any = '';
  encryptedOldPassword: any = '';
  id: any;
  passwordData: any;

  ngOnInit(): void {
    this.id = this.authService.getRole().id;
    console.log('ffidid', this?.id);
    // console.log(this.hospitalService)
  }

  // get ConfirmPassword() {
  //   return this.changePasswordForm.get('ConfirmPassword');
  // }

  onChangePasswordSubmit() {
    const fd: any = {
      old_password: this.changePasswordForm.value['oldPassword'],
      new_password: this.changePasswordForm.value['newPassword'],
    };

    // this.passwordData = { ...this.changePasswordForm.value, id: this.id};
    this.hospitalService
      .changePassword(this.id, fd)
      .subscribe((response: any) => {
        console.log('res', response);
        this.loaderSpin = true;
        if (response.success) {
          this.toaster.success(response.message);
          setTimeout(() => {
            this.authService.onHospitalLogout();

            this.router.navigate(['/login']);
            this.loaderSpin = false;
          }, 3000);
        } else {
          this.toaster.error(response.message);
          setTimeout(() => {
            this.loaderSpin = false;
          }, 3000);
        }
      });
  }
  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }
  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }
}
