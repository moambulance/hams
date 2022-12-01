import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { get } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-manage-beds',
  templateUrl: './manage-beds.component.html',
  styleUrls: ['./manage-beds.component.css'],
})
export class ManageBedsComponent implements OnInit {
  hospitalBedForm!: FormGroup;
  bedDetailsLength: number = 0;
  is_checked: any;
  hospitalId: number = 0;
  breadCrumbData: any = {
    heading: 'Manage Beds',
    routing: [
      {
        routerHeading: 'hospitals/manage-beds',
        routerLink: '/hospitals/manage-beds',
      },
    ],
  };
  bedId: number = 0;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private authService: AuthService,
  ) {
    this.hospitalBedForm = this.formBuilder.group({
      emergency_bed: ['', [Validators.required]],
      icu_bed: ['', [Validators.required]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          ),
        ],
      ],
      nicu_bed: ['', [Validators.required]],
      dialysis_bed: ['', [Validators.required]],
      emergency_doctor: ['', [Validators.required]],
      is_active: [''],
    });
  }

  ngOnInit(): void {
    this.getBedDetails();
    this.showSpinner();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  getBedDetails() {
    // console.log("atob(token?.split('.')[1])", atob(token?.split('.')[1]));
    const user = this.authService.getRole();
    this.hospitalId = user?.id;
    this.hospitalBedForm.reset();
    this.is_checked = 0;

    this.hospitalService
      .getHospitalDetailsByHospitalId(this.hospitalId)
      .subscribe((response: any) => {
        if (response) {
          this.bedId = response.id;
          this.bedDetailsLength = response?.length;
          this.is_checked = response?.is_active;
          console.log('details', response);
          this.hospitalBedForm.patchValue({
            emergency_bed: response?.emergency_bed,
            icu_bed: response?.icu_bed,
            nicu_bed: response?.nicu_bed,
            dialysis_bed: response?.dialysis_bed,
            emergency_doctor: response?.emergency_doctor,
            phone: response?.phone,
            is_active: this.is_checked,
          });
        }
      });
  }
  // onBedActive(event: any) {
  //   console.log('event', event.target.checked);
  //   if (event.target.checked) {
  //     this.is_checked = 1;
  //   }
  //   this.is_checked = 0;
  // }
  get emergency_bed() {
    return this.hospitalBedForm.get('emergency_bed');
  }
  get phone() {
    return this.hospitalBedForm.get('phone');
  }
  get icu_bed() {
    return this.hospitalBedForm.get('icu_bed');
  }
  get nicu_bed() {
    return this.hospitalBedForm.get('nicu_bed');
  }
  get dialysis_bed() {
    return this.hospitalBedForm.get('dialysis_bed');
  }
  get emergency_doctor() {
    return this.hospitalBedForm.get('emergency_doctor');
  }
  onSubmitBed() {
    let saveInputs: any;
    if (this.bedDetailsLength === 0) {
      saveInputs = {
        hospital_id: this.hospitalId,
        emergency_bed: this.hospitalBedForm.value['emergency_bed'],
        icu_bed: this.hospitalBedForm.value['icu_bed'],
        nicu_bed: this.hospitalBedForm.value['nicu_bed'],
        dialysis_bed: this.hospitalBedForm.value['dialysis_bed'],
        emergency_doctor: this.hospitalBedForm.value['emergency_doctor'],
        phone: this.hospitalBedForm.value['phone'],
        is_active: this.is_checked,
      };
      console.log('id', saveInputs);

      this.hospitalService
        .saveHospitalDetails(saveInputs)
        .subscribe((response: any) => {
          console.log('this.hospitalBedForm.value', response);
          this.hospitalId = 0;
        });
      console.log('ds', saveInputs);
    } else {
      saveInputs = {
        hospital_id: this.hospitalId,
        emergency_bed: this.hospitalBedForm.value['emergency_bed'],
        icu_bed: this.hospitalBedForm.value['icu_bed'],
        nicu_bed: this.hospitalBedForm.value['nicu_bed'],
        dialysis_bed: this.hospitalBedForm.value['dialysis_bed'],
        emergency_doctor: this.hospitalBedForm.value['emergency_doctor'],
        phone: this.hospitalBedForm.value['phone'],
        is_active: this.is_checked,
      };

      this.hospitalService
        .updateHospitalDetailsById(this.bedId, saveInputs)
        .subscribe((response: any) => {
          this.hospitalId = 0;
          this.toast.success(response.message);

          setTimeout(() => {
            this.router.navigateByUrl('/hospital/dashboard');
            this.showSpinner();
          }, 1000);
        });
    }
  }
}
