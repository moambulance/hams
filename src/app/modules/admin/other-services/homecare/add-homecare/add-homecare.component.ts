import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ServiceTypeService } from '../../../master/service-type/service-type.service';
import { HomecareService } from '../homecare.service';

@Component({
  selector: 'app-add-homecare',
  templateUrl: './add-homecare.component.html',
  styleUrls: ['./add-homecare.component.css'],
})
export class AddHomecareComponent implements OnInit {
  breadCrumbData: any;
  ShowFilter: boolean = true;
  baseUrl: any = environment.BASE_URL;
  homecareServiceShowFilter: boolean = true;
  prescriptionImageChange: boolean = false;
  homecareDepartmentShowFilter: boolean = true;
  homecareForm!: FormGroup;
  countryList: any;
  stateLists: any;
  homecareId: number = 0;
  // Details: (List: any) => void;
  cities: any;
  prescriptionImg: any = '';
  prescriptionUrl: any = '';
  allServices: any;
  meridian = true;
  time!: NgbTimeStruct;
  time2!: NgbTimeStruct;
  // times: any = { hour: 08, minute: 45 };
  homecareTypeDropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    enableCheckAll: false,
    allowSearchFilter: this.ShowFilter,
  };
  timeShift: boolean = false;
  homecareServiceDropdownSettings: any;

  homecareDepartmentDropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    enableCheckAll: false,
    allowSearchFilter: this.homecareDepartmentShowFilter,
  };
  homecareDepartmentArray: any = [];
  homecareDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private homecareService: HomecareService,
    private serviceType: ServiceTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
  ) {
    this.homecareForm = this.formBuilder.group({
      customer_name: ['', [Validators.required]],
      customer_email: ['', [Validators.required]],
      customer_mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          ),
        ],
      ],
      address_line1: ['', [Validators.required]],
      address_line2: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      prefered_date: ['', [Validators.required]],
      service_type_id: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      status: ['', [Validators.required]],
      created_by: [1],
      prescription: ['', [Validators.required]],
    });

    this.homecareForm.controls['country'].setValue(0);
    this.homecareForm.controls['state'].setValue(0);
    this.homecareForm.controls['city'].setValue(0);
    this.homecareForm.controls['status'].setValue(-1);
  }
  ngOnInit(): void {
    this.time = { hour: 10, minute: 30, second: 0 };
    this.time2 = { hour: 4, minute: 15, second: 0 };
    this.homecareTypeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      enableCheckAll: false,
      allowSearchFilter: this.ShowFilter,
    };
    this.showSpinner();
    this.breadCrumbDetails();
    this.getAllServices();
    this.gethomecareId();
  }
  // homecare edit patch values
  gethomecareId() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.homecareId = Number(params.get('id'));
      console.log('id', this.homecareId);

      if (this.homecareId !== 0) {
        this.homecareService
          .getHomecareById(this.homecareId)
          .subscribe((response: any) => {
            if (response?.start_time?.includes('AM')) {
              this.time = {
                hour: parseInt(response?.start_time?.split(':')[0]),
                minute: parseInt(
                  response?.start_time?.split(':')[1].slice(0, 2),
                ),
                second: 0,
              };
            } else {
              this.time = {
                hour: 12 + parseInt(response?.start_time?.split(':')[0]),
                minute: parseInt(
                  response?.start_time?.split(':')[1].slice(0, 2),
                ),
                second: 0,
              };
            }
            if (response?.end_time?.includes('AM')) {
              this.time2 = {
                hour: parseInt(response?.end_time?.split(':')[0]),
                minute: parseInt(response?.end_time?.split(':')[1].slice(0, 2)),
                second: 0,
              };
            } else {
              this.time2 = {
                hour: 12 + parseInt(response?.end_time?.split(':')[0]),
                minute: parseInt(response?.end_time?.slice(3, 5)),
                second: 0,
              };
            }
            console.log('d', response.service_type_id);
            this.homecareDetails = response;
            this.homecareDepartmentArray = [];

            this.homecareForm.patchValue({
              customer_name: response?.customer_name,
              customer_email: response?.customer_email,
              customer_mobile: response?.customer_mobile,
              address_line1: response?.address_line1,
              address_line2: response?.address_line2,
              prefered_date: response?.prefered_date,
              pincode: response?.pincode,
              status: response?.status,
              service_type_id: response?.service_type_id.map((mt: any) => {
                let object: any = {
                  id: mt.id,
                  name: mt.name,
                };
                this.onSelectHomecareDepartment(object);
                return object;
              }),
            });

            this.onCountrySelect(101, '');
            this.homecareForm.controls['country'].setValue(101);
            this.onStateSelect(response.state_id, '');
            this.homecareForm.controls['state'].setValue(
              this.homecareDetails.state_id,
            );

            this.homecareForm.controls['city'].setValue(
              this.homecareDetails.city_id,
            );
            this.homecareForm.controls['status'].setValue(
              this.homecareDetails.status,
            );
            this.prescriptionUrl = this.baseUrl + response?.prescription;
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
  getAllServices() {
    this.serviceType.getAllServiceType().subscribe((response: any) => {
      this.allServices = response?.map((md: any) => {
        this.onSelectHomecareDepartment(md);
        return {
          id: md.id,
          name: md.name,
        };
      });
    });
  }
  getCountry() {
    this.homecareService.getCountry().subscribe((response: any) => {
      this.countryList = response;
    });
  }
  onSelectHomecareDepartment(service: any) {
    console.log('looo', service);
    this.homecareDepartmentArray.push(service.id);
  }
  onDeSelectHomecareDepartment(item: any) {
    console.log(item);
    let index = this.homecareDepartmentArray.findIndex(
      (id: any) => id == item.ward_no,
    );
    this.homecareDepartmentArray.splice(index, 1);
    if (this.homecareDepartmentArray.length === 0) {
      // this.surveyFilterForm.reset();
      this.getAllServices();
    }
  }
  onPrescriptionUpload(uploadedFile: any) {
    this.prescriptionImg = uploadedFile.target.files[0];
    this.prescriptionImageChange = true;
    const reader = new FileReader();
    reader.readAsDataURL(this.prescriptionImg);

    reader.onload = (_event) => {
      this.prescriptionUrl = reader.result;
    };
  }
  onCountrySelect(country_id?: any, type?: any) {
    const countryId =
      country_id == '' || country_id == undefined
        ? this.homecareForm.value['country']
        : country_id;
    console.log('==============>>>>', countryId);
    if (countryId != 0) {
      console.log('cccccc', countryId);

      this.homecareService
        .getStateByCountryId(countryId)
        .subscribe((response: any) => {
          this.stateLists = response?.data;
          // if (type == 'init') {
          //   this.updateField(this.List);
          // }
        });
    }
  }
  // updateField(List: any) {
  //   console.log('ff', List);
  // }
  // List(List: any) {
  //   throw new Error('Method not implemented.');
  // }

  onStateSelect(stateId?: any, type?: any) {
    const state =
      stateId == '' || stateId == undefined
        ? this.homecareForm.value['state']
        : stateId;
    if (state != 0) {
      this.homecareService
        .getCitiesByStateId(state)
        .subscribe((response: any) => {
          this.cities = response?.data;
          if (type == 'init') {
            // this.updateField(this.Details);
          }
        });
    }
  }

  onAdd() {
    const formValue: any = this.homecareForm?.value;
    console.log('this', formValue);
    let fd = new FormData();
    let time = this.homecareForm.value['start_time'];
    let startTime = '';
    if (time.hour > 12) {
      startTime = time.hour - 12 + ':' + time.minute + ' ' + 'PM';
    } else {
      startTime = time.hour + ':' + time.minute + ' ' + 'AM';
    }
    let time2 = this.homecareForm.value['end_time'];
    let endTime = '';
    if (time2.hour > 12) {
      endTime = time2.hour - 12 + ':' + time2.minute + ' ' + 'PM';
    } else {
      endTime = time2.hour + ':' + time2.minute + ' ' + 'AM';
    }

    fd.append('customer_name', formValue['customer_name']);
    fd.append('customer_email', formValue['customer_email']);
    fd.append('customer_mobile', formValue['customer_mobile']);
    fd.append('address_line1', formValue['address_line1']);
    fd.append('address_line2', formValue['address_line2']);
    fd.append('pincode', formValue['pincode']);
    fd.append('city_id', formValue['city']);
    fd.append('state_id', formValue['state']);
    fd.append('status', formValue['status']);
    fd.append('created_by', '1');
    fd.append('prefered_date', formValue['prefered_date']);
    fd.append('start_time', startTime);
    fd.append('end_time', endTime);
    fd.append('service_type_id', this.homecareDepartmentArray.toString());

    fd.append('prescription', this.prescriptionImg);

    console.log('FD', formValue);
    if (this.homecareId === 0) {
      this.homecareService.saveHomecare(fd).subscribe((response: any) => {
        console.log('response', response);
        if (response?.success) {
          this.toaster.success(response?.message);
          // this.message = response?.message;
          setTimeout(() => {
            // this.message = '';
            this.homecareForm.reset();
            this.router.navigateByUrl('/admin/homecare');
          }, 2000);
        }
      });
    } else {
      console.log('FUD', formValue);

      this.homecareService
        .updateHomecare(this.homecareId, fd)
        .subscribe((response: any) => {
          console.log('response', response);
          if (response?.success) {
            this.toaster.success(response?.message);

            // this.message = response?.message;
            setTimeout(() => {
              // this.message = '';
              this.homecareForm.reset();
              this.router.navigateByUrl('/admin/homecare');
            }, 2000);
          }
        });
    }
  }

  breadCrumbDetails() {
    if (this.router.url === '/admin/homecare/add-homecare') {
      this.breadCrumbData = {
        heading: 'Add HomeCare',
        routing: [
          {
            routerHeading: 'homecare',
            routerLink: '/admin/homecare',
          },
          {
            routerHeading: 'add-homecare',
            routerLink: '/admin/homecare/add-homecare',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'Edit HomeCare',
        routing: [
          {
            routerHeading: 'HomeCare',
            routerLink: '/admin/homecare',
          },
          {
            routerHeading: 'edit-homecare',
            routerLink: '/admin/homecare/edit-homecare',
          },
        ],
      };
    }
  }
  get customer_name() {
    return this.homecareForm.get('customer_name');
  }
  get customer_email() {
    return this.homecareForm.get('customer_email');
  }
  get customer_mobile() {
    return this.homecareForm.get('customer_mobile');
  }
  get address_line1() {
    return this.homecareForm.get('address_line1');
  }
  get address_line2() {
    return this.homecareForm.get('address_line2');
  }
  get country() {
    return this.homecareForm.get('country');
  }
  get state() {
    return this.homecareForm.get('state');
  }
  get city() {
    return this.homecareForm.get('city_id');
  }
  get pincode() {
    return this.homecareForm.get('pincode');
  }
}
