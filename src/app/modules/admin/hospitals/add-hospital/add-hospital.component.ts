import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-add-hospital',
  templateUrl: './add-hospital.component.html',
  styleUrls: ['./add-hospital.component.css'],
})
export class AddHospitalComponent implements OnInit {
  baseUrl: any = environment.BASE_URL;
  hospitalForm!: FormGroup;
  is_checked: any;
  @ViewChild('profileImageFile') profileImage!: ElementRef;
  hospitalId: any = 0;
  responseFalure: boolean = false;

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
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
    });
    this.hospitalForm.controls['country'].setValue(0);
    this.hospitalForm.controls['state'].setValue(0);
    this.hospitalForm.controls['city'].setValue(0);
  }

  ngOnInit() {
    this.breadCrumbDetails();
    this.showSpinner();
    this.hospitalTypeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      enableCheckAll: false,
      allowSearchFilter: this.ShowFilter,
    };

    this.hospitalserviceDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      enableCheckAll: false,
      allowSearchFilter: this.hospitalserviceShowFilter,
    };

    this.hospitalDepartmentDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      enableCheckAll: false,
      allowSearchFilter: this.hospitalDepartmentShowFilter,
    };
    // this.getHospitalDetails();
    this.getHospitalType();
    this.getHospitalAvailableService();
    this.getHospitalDepartment();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.hospitalId = Number(params.get('id'));
      if (this.hospitalId) {
        this.hospitalService
          .getHospitalById(this.hospitalId)
          .subscribe((response: any) => {
            console.log('res', response);

            this.hospitalDetails = response;
            this.updatehospitalField(this.hospitalDetails);
            this.hospitalImage = response.logo;
            this.onCountrySelect(response.address1.country_id, 'init');
            this.onStateSelect(response.address1.state_id, 'init');
          });
      }
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
  onSelectHospitalType(item: any) {
    this.hospitalTypeArray.push(item.id);
  }

  onSelectHospitalService(service: any) {
    // if(this.hospitalId){

    // }
    this.hospitalServiceArray.push(service.id);
  }

  onDeSelectHospitalService(item: any) {
    // if(this.hospitalId){
    //   this.hospitalServiceArray = this.hospitalDetails.available_service_details.map((hs: any) => {
    //     return{
    //       id: hs.id,
    //       name: hs.name
    //     }
    //   })
    // }
    let index = this.hospitalServiceArray.findIndex(
      (id: any) => id == item.ward_no,
    );
    this.hospitalServiceArray.splice(index, 1);
    if (this.hospitalServiceArray.length === 0) {
      // this.surveyFilterForm.reset();
      this.getHospitalAvailableService();
    }
  }

  onSelectHospitalDepartment(service: any) {
    this.hospitalDepartmentArray.push(service.id);
  }

  onDeSelectHospitalDepartmen(item: any) {
    let index = this.hospitalDepartmentArray.findIndex(
      (id: any) => id == item.ward_no,
    );
    this.hospitalDepartmentArray.splice(index, 1);
    if (this.hospitalDepartmentArray.length === 0) {
      // this.surveyFilterForm.reset();
      this.getHospitalDepartment();
    }
  }

  onDeSelect(item: any) {
    let index = this.hospitalTypeArray.findIndex(
      (id: any) => id == item.ward_no,
    );
    this.hospitalTypeArray.splice(index, 1);
    if (this.hospitalTypeArray.length === 0) {
      // this.surveyFilterForm.reset();
      this.getHospitalType();
    }
  }
  updatehospitalField(hospitalDetails?: any) {
    this.hospitalServiceArray =
      this.hospitalDetails.available_service_details.map((hs: any) => {
        return hs.id;
      });

    this.hospitalTypeArray = hospitalDetails.type_of_he_details.map(
      (ht: any) => {
        return ht.id;
      },
    );

    this.hospitalDepartmentArray = hospitalDetails.department_details.map(
      (hd: any) => {
        return hd.id;
      },
    );
    this.hospitalForm.patchValue({
      name: hospitalDetails.name,
      email: hospitalDetails.email,
      mobile: hospitalDetails.mobile,
      location: hospitalDetails.location,
      CE_number: hospitalDetails.CE_number,
      municipality_number: hospitalDetails.municipality_number,
      doctor_emergency: hospitalDetails.emergency_doctor_name,
      emergency_no: hospitalDetails.emergency_number,
      address_1: hospitalDetails.address1.address,
      address_2: hospitalDetails.address1.address2,
      // country: hospitalDetails,
      // state: hospitalDetails,
      // city: hospitalDetails,
      pincode: hospitalDetails.address1.pincode,
      ambulance_availability: parseInt(hospitalDetails.ambulance_availability),
      // logo: hospitalDetails,
      hospitalType: hospitalDetails.type_of_he_details.map((ht: any) => {
        return {
          id: ht.id,
          name: ht.name,
        };
      }),
      hospitalDepartment: hospitalDetails.department_details.map((hd: any) => {
        return {
          id: hd.id,
          name: hd.name,
        };
      }),
      hospitalService: hospitalDetails.available_service_details.map(
        (hs: any) => {
          return {
            id: hs.id,
            name: hs.name,
          };
        },
      ),
      bls_base_fare: hospitalDetails.bls_base_fare,
      bls_per_km_fare_slab1: hospitalDetails.bls_per_km_fare_slab1,
      bls_per_km_fare_slab2: hospitalDetails.bls_per_km_fare_slab2,
      bls_oxygen_per_km: hospitalDetails.bls_oxygen_per_km,
      als_base_fare: hospitalDetails.als_base_fare,
      als_per_km_fare_slab1: hospitalDetails.als_per_km_fare_slab1,
      als_per_km_fare_slab2: hospitalDetails.als_per_km_fare_slab2,
      als_oxygen_per_km: hospitalDetails.als_oxygen_per_km,
      covid_ppe_cost: hospitalDetails.covid_ppe_cost,
    });
    this.hospitalForm.controls['country'].setValue(
      hospitalDetails.address1.country_id,
    );
    this.hospitalForm.controls['state'].setValue(
      hospitalDetails.address1.state_id,
    );
    this.hospitalForm.controls['city'].setValue(hospitalDetails.address1.city);
    this.profileImageBrowse = this.baseUrl + hospitalDetails.logo;
  }
  getHospitalType() {
    this.hospitalService.getHeTypes().subscribe((response: any) => {
      this.hospitalTypes = response.map((h: any) => {
        return {
          id: h.id,
          name: h.name,
        };
      });
    });
  }
  getHospitalAvailableService() {
    this.hospitalService
      .getHospitalAvailableServices()
      .subscribe((response: any) => {
        this.hospitalAvailableServices = response.map((hs: any) => {
          return {
            id: hs.id,
            name: hs.name,
          };
        });
      });
  }
  getHospitalDepartment() {
    this.hospitalService.getHospitalDepartments().subscribe((response: any) => {
      this.hospitalDepartment = response.map((hd: any) => {
        return {
          id: hd.id,
          name: hd.name,
        };
      });
    });
  }

  onProfileImageChange(file: any) {
    if (this.hospitalId != '') {
      this.isImageChange = true;
    }
    if (file.target.files && file.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageBrowse = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);
    }
  }

  getCountry() {
    this.hospitalService.getCountry().subscribe((response: any) => {
      this.countryList = response;
    });
  }

  onCountrySelect(country_id?: any, type?: any) {
    const countryId =
      country_id == '' || country_id == undefined
        ? this.hospitalForm.value['country']
        : country_id;
    if (countryId != 0) {
      this.hospitalService
        .getStateByCountryId(countryId)
        .subscribe((response: any) => {
          this.stateLists = response.data;
          if (type == 'init') {
            this.updatehospitalField(this.hospitalDetails);
          }
        });
    }
  }

  onStateSelect(stateId?: any, type?: any) {
    const state_id =
      stateId == '' || stateId == undefined
        ? this.hospitalForm.value['state']
        : stateId;
    if (state_id != 0) {
      this.hospitalService
        .getCitiesByStateId(state_id)
        .subscribe((response: any) => {
          this.cities = response.data;
          if (type == 'init') {
            this.updatehospitalField(this.hospitalDetails);
          }
        });
    }
  }
  onCreateHospital() {
    let fd = new FormData();
    fd.append('name', this.hospitalForm.value['name']);
    fd.append('email', this.hospitalForm.value['email']);
    fd.append('mobile', this.hospitalForm.value['mobile']);
    fd.append('location', this.hospitalForm.value['location']);
    fd.append('CE_number', this.hospitalForm.value['CE_number']);
    fd.append(
      'municipality_number',
      this.hospitalForm.value['municipality_number'],
    );
    fd.append(
      'emergency_doctor_name',
      this.hospitalForm.value['doctor_emergency'],
    );
    fd.append('emergency_number', this.hospitalForm.value['emergency_no']);
    fd.append('address', this.hospitalForm.value['address_1']);
    fd.append('address_2', this.hospitalForm.value['address_2']);
    fd.append('country_id', this.hospitalForm.value['country']);
    fd.append('state_id', this.hospitalForm.value['state']);
    fd.append('city', this.hospitalForm.value['city']);
    fd.append('pincode', this.hospitalForm.value['pincode']);
    fd.append(
      'ambulance_availability',
      this.hospitalForm.value['ambulance_availability'],
    );
    fd.append('type_of_he', this.hospitalTypeArray.toString());
    fd.append('departments', this.hospitalDepartmentArray.toString());
    fd.append('available_services', this.hospitalServiceArray.toString());
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
    fd.append('is_approved', '1');
    let file = this.profileImage.nativeElement.files[0];
    if (this.hospitalId) {
      fd.append('logo', this.isImageChange == true ? file : this.hospitalImage);
    } else {
      fd.append('logo', file != undefined ? file : '');
    }
    fd.append('ambulance_availability_value', '1,2');

    if (!this.hospitalId) {
      this.hospitalService.addHospital(fd).subscribe((response: any) => {
        if (response.success) {
          this.toaster.success(response.message);
          this.message = response.message;
          setTimeout(() => {
            this.message = '';
            this.hospitalForm.reset();
            this.router.navigateByUrl('/admin/hospitals');
          }, 2000);
        } else {
          console.log('response');

          this.responseFalure = true;
        }
      });
    } else {
      this.hospitalService
        .updateHospital(this.hospitalId, fd)
        .subscribe((response: any) => {
          console.log(response);

          if (response.success) {
            this.toaster.success(response.message);

            this.message = response.message;
            setTimeout(() => {
              this.message = '';
              this.hospitalForm.reset();
              this.router.navigateByUrl('/admin/hospitals');
            }, 2000);
          } else {
            console.log('response');
            this.responseFalure = true;
          }
        });
    }
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
    if (this.router.url === '/admin/hospitals/add-hospital') {
      this.breadCrumbData = {
        heading: 'Add Hospital',
        routing: [
          {
            routerHeading: 'hospital',
            routerLink: '/admin/hospitals',
          },
          {
            routerHeading: 'add-hospital',
            routerLink: '/admin/hospitals/add-hospital',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'Edit Hospital',
        routing: [
          {
            routerHeading: 'hospital',
            routerLink: '/admin/hospitals',
          },
          {
            routerHeading: 'edit-hospital',
            routerLink: '/admin/hospitals/edit-hospital',
          },
        ],
      };
    }
  }
}
