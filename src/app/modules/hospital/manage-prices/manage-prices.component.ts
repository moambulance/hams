import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-manage-prices',
  templateUrl: './manage-prices.component.html',
  styleUrls: ['./manage-prices.component.css'],
})
export class ManagePricesComponent implements OnInit {
  baseUrl: any = '';
  hospitalForm!: FormGroup;
  is_checked: any;
  adharFrontUrl: any = '';
  adharBackUrl: any = '';
  profileUrl: any = '';
  dlUrl: any = '';
  @ViewChild('profileImageFile') profileImage!: ElementRef;
  adharFrontSrc: any = '';
  adharBackSrc: any = '';
  dlSrc: any = '';
  profileSrc: any = '../../../../assets/Image/default.jpeg';
  hospitalId: number = 0;

  hospitalDetails: any;
  profileImageBrowse: any;
  hospitalTypes: any = [];
  hospitalAvailableServices: any;
  hospitalDepartment: any;
  hospitalTypeArray: any = [];
  hospitalServiceArray: any = [];
  hospitalDepartmentArray: any = [];
  countryList: any;
  stateLists: any;
  cities: any;
  message: string = '';
  hospitalImage: any;
  isImageChange: boolean = false;
  hospitalTypeDropdownSettings: any = {};
  ShowFilter: boolean = true;
  hospitalserviceDropdownSettings: any;
  hospitalserviceShowFilter: boolean = true;
  hospitalDepartmentDropdownSettings: any;
  hospitalDepartmentShowFilter: boolean = true;
  breadCrumbData: any;
  hospitalDetals: any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private authService: AuthService,
  ) {
    this.hospitalForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      location: ['', [Validators.required]],
      CE_number: ['', [Validators.required]],
      municipality_number: ['', [Validators.required]],
      doctor_emergency: ['', [Validators.required]],
      emergency_no: ['', [Validators.required]],
      address_1: ['', [Validators.required]],
      address_2: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      ambulance_availability: ['', [Validators.required]],
      logo: ['', [Validators.required]],
      hospitalType: ['', [Validators.required]],
      hospitalDepartment: ['', [Validators.required]],
      hospitalService: ['', [Validators.required]],
      bls_base_fare: ['', [Validators.required]],
      bls_per_km_fare_slab1: ['', [Validators.required]],
      bls_per_km_fare_slab2: ['', [Validators.required]],
      bls_oxygen_per_km: ['', [Validators.required]],
      als_base_fare: ['', [Validators.required]],
      als_per_km_fare_slab1: ['', [Validators.required]],
      als_per_km_fare_slab2: ['', [Validators.required]],
      als_oxygen_per_km: ['', [Validators.required]],
      covid_ppe_cost: ['', [Validators.required]],
      platformServicePercentage: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.breadCrumbDetails();
    this.showSpinner();
    this.getHospitalById();
  }
  getHospitalById() {
    // console.log("atob(token?.split('.')[1])", atob(token?.split('.')[1]));
    const user = this.authService.getRole();
    this.hospitalId = user?.id;
    this.hospitalService
      .getHospitalById(user?.id)
      .subscribe((response: any) => {
        this.hospitalDetals = response;
        console.log('als response', response);

        this.hospitalForm.patchValue({
          bls_base_fare: response.bls_base_fare,
          bls_per_km_fare_slab1: response.bls_per_km_fare_slab1,
          bls_per_km_fare_slab2: response.bls_per_km_fare_slab2,
          bls_oxygen_per_km: response.bls_oxygen_per_km,
          als_base_fare: response.als_base_fare,
          als_per_km_fare_slab1: response.als_per_km_fare_slab1,
          als_per_km_fare_slab2: response.als_per_km_fare_slab2,
          als_oxygen_per_km: response.als_oxygen_per_km,
          covid_ppe_cost: response.covid_ppe_cost,
          platformServicePercentage: response.platformServicePercentage
            ? response.platformServicePercentage
            : 10,
        });
      });
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  onPlatformPercentage(event: any) {
    console.log('event.target.value', event.target.value);

    if (event.target.value > 100) {
      this.hospitalForm.patchValue({
        platformServicePercentage: 100,
      });
    }
  }
  onCreateHospital() {
    let fd = new FormData();
    fd.append('name', this.hospitalDetals.name);
    fd.append('email', this.hospitalDetals.email);
    fd.append('mobile', this.hospitalDetals.mobile);
    fd.append('location', this.hospitalDetals.location);
    fd.append('CE_number', this.hospitalDetals.CE_number);
    fd.append('municipality_number', this.hospitalDetals.municipality_number);
    fd.append(
      'emergency_doctor_name',
      this.hospitalDetals.emergency_doctor_name,
    );
    fd.append('emergency_number', this.hospitalDetals.emergency_number);
    fd.append('address', this.hospitalDetals.address);
    fd.append('address_2', this.hospitalDetals.address_2);
    fd.append('country_id', this.hospitalDetals.country_id);
    fd.append('state_id', this.hospitalDetals.state_id);
    fd.append('city', this.hospitalDetals.city);
    fd.append('pincode', this.hospitalDetals.pincode);
    fd.append(
      'ambulance_availability',
      this.hospitalDetals.ambulance_availability,
    );
    fd.append('type_of_he', this.hospitalDetals.type_of_he);
    fd.append('departments', this.hospitalDetals.departments);
    fd.append('available_services', this.hospitalDetals.available_services);
    // fd.append("ambulance_availability", this.hospitalForm.value['ambulance_availability']);
    fd.append('bls_base_fare', this.hospitalForm.value['bls_base_fare']);
    fd.append(
      'bls_per_km_fare_slab1',
      this.hospitalForm.value['bls_per_km_fare_slab1'],
    );
    fd.append(
      'bls_per_km_fare_slab2',
      this.hospitalForm.value['bls_per_km_fare_slab2'],
    );
    fd.append(
      'bls_oxygen_per_km',
      this.hospitalForm.value['bls_oxygen_per_km'],
    );
    fd.append('als_base_fare', this.hospitalForm.value['als_base_fare']);
    fd.append(
      'als_per_km_fare_slab1',
      this.hospitalForm.value['als_per_km_fare_slab1'],
    );
    fd.append(
      'als_per_km_fare_slab2',
      this.hospitalForm.value['als_per_km_fare_slab2'],
    );
    fd.append(
      'als_oxygen_per_km',
      this.hospitalForm.value['als_oxygen_per_km'],
    );
    fd.append('covid_ppe_cost', this.hospitalForm.value['covid_ppe_cost']);
    fd.append(
      'platformServicePercentage',
      this.hospitalForm.value['platformServicePercentage'],
    );
    fd.append('is_approved', '1');
    fd.append('is_active', this.hospitalDetals.is_active);
    fd.append('logo', this.hospitalDetals.logo);

    fd.append('ambulance_availability_value', '1,2');
    console.log('adda', fd);

    console.log('adda', fd);

    this.hospitalService
      .updateHospital(this.hospitalId, fd)
      .subscribe((response: any) => {
        if (response.success) {
          this.toast.success(response.message);
          this.message = response.message;
          setTimeout(() => {
            this.message = '';
            this.hospitalForm.reset();
            this.router.navigateByUrl('/hospital/dashboard');
            this.showSpinner();
          }, 1000);
        }
      });
  }

  get name() {
    return this.hospitalForm.get('name');
  }
  get email() {
    return this.hospitalForm.get('email');
  }
  get mobile() {
    return this.hospitalForm.get('mobile');
  }
  get location() {
    return this.hospitalForm.get('location');
  }
  get CE_number() {
    return this.hospitalForm.get('CE_number');
  }
  get municipality_number() {
    return this.hospitalForm.get('municipality_number');
  }
  get doctor_emergency() {
    return this.hospitalForm.get('doctor_emergency');
  }
  get emergency_no() {
    return this.hospitalForm.get('emergency_no');
  }
  get address_1() {
    return this.hospitalForm.get('address_1');
  }
  get address_2() {
    return this.hospitalForm.get('address_2');
  }
  get country() {
    return this.hospitalForm.get('country');
  }
  get state() {
    return this.hospitalForm.get('state');
  }
  get city() {
    return this.hospitalForm.get('city');
  }
  get pincode() {
    return this.hospitalForm.get('pincode');
  }

  get ambulance_availability() {
    return this.hospitalForm.get('ambulance_availability');
  }

  get hospitalDepartments() {
    return this.hospitalForm.get('hospitalDepartment');
  }

  get hospitalAvailableService() {
    return this.hospitalForm.get('hospitalService');
  }

  get hospitalType() {
    return this.hospitalForm.get('hospitalType');
  }
  breadCrumbDetails() {
    if (this.router.url === '/hospital/manage-prices') {
      this.breadCrumbData = {
        heading: 'Manage Prices',
        routing: [
          {
            routerHeading: 'hospitals/manage-prices',
            routerLink: '/hospitals/manage-prices',
          },
        ],
      };
    }
  }
}
