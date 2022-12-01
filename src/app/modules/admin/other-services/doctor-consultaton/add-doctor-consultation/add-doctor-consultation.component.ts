import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { SpecialistTypeService } from '../../../master/specialist-type/specialist-type.service';
import { DoctorConsultationService } from '../doctor-consultation.service';

@Component({
  selector: 'app-add-doctor-consultation',
  templateUrl: './add-doctor-consultation.component.html',
  styleUrls: ['./add-doctor-consultation.component.css'],
})
export class AddDoctorConsultationComponent implements OnInit {
  breadCrumbData: any;
  ShowFilter: boolean = true;
  baseUrl: any = environment.BASE_URL;
  doctorConsultationServiceShowFilter: boolean = true;
  doctorConsultationDepartmentShowFilter: boolean = true;
  doctorConsultationForm!: FormGroup;
  countryList: any;
  stateLists: any;
  doctorConsultationId: number = 0;
  // Details: (List: any) => void;
  cities: any;
  prescriptionImg: any = '';
  prescriptionUrl: any = '';
  allSpecialists: any;
  meridian = true;
  time!: NgbTimeStruct;
  time2!: NgbTimeStruct;
  // times: any = { hour: 08, minute: 45 };
  doctorConsultationTypeDropdownSettings: any = {
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
  doctorConsultationServiceDropdownSettings: any;

  doctorConsultationDepartmentDropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    enableCheckAll: false,
    allowSearchFilter: this.doctorConsultationDepartmentShowFilter,
  };
  doctorConsultationDepartmentArray: any = [];
  doctorConsultationDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private doctorConsultationService: DoctorConsultationService,
    private specialistService: SpecialistTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
  ) {
    this.doctorConsultationForm = this.formBuilder.group({
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
      appointment_date: ['', [Validators.required]],
      specialist_type_id: ['', [Validators.required]],
      prefer_time_from: ['', [Validators.required]],
      prefer_time_to: ['', [Validators.required]],
      status: ['', [Validators.required]],
      created_by: [1],
      prescription: ['', [Validators.required]],
    });

    this.doctorConsultationForm.controls['country'].setValue(0);
    this.doctorConsultationForm.controls['state'].setValue(0);
    this.doctorConsultationForm.controls['city'].setValue(0);
    this.doctorConsultationForm.controls['status'].setValue(-1);
  }
  ngOnInit(): void {
    this.time = { hour: 10, minute: 30, second: 0 };
    this.time2 = { hour: 4, minute: 15, second: 0 };
    this.doctorConsultationTypeDropdownSettings = {
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
    this.getAllSpecialists();
    this.getDoctorConsultationId();
  }
  // doctorConsultation edit patch values
  getDoctorConsultationId() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.doctorConsultationId = Number(params.get('id'));
      // console.log('id', this.doctorConsultationId);

      if (this.doctorConsultationId !== 0) {
        this.doctorConsultationService
          .getDoctorConsultationById(this.doctorConsultationId)
          .subscribe((response: any) => {
            // console.log('rrrr', response);

            this.doctorConsultationDepartmentArray = [];
            if (response?.prefer_time_from?.includes('AM')) {
              this.time = {
                hour: parseInt(response?.prefer_time_from?.split(':')[0]),
                minute: parseInt(
                  response?.prefer_time_from?.split(':')[1].slice(0, 2),
                ),
                second: 0,
              };
            } else {
              this.doctorConsultationDepartmentArray = [];
              this.time = {
                hour: 12 + parseInt(response?.prefer_time_from?.split(':')[0]),
                minute: parseInt(
                  response?.prefer_time_from?.split(':')[1].slice(0, 2),
                ),
                second: 0,
              };
            }
            if (response?.prefer_time_to?.includes('AM')) {
              this.time2 = {
                hour: parseInt(response?.prefer_time_to?.split(':')[0]),
                minute: parseInt(
                  response?.prefer_time_to?.split(':')[1].slice(0, 2),
                ),
                second: 0,
              };
            } else {
              this.time2 = {
                hour: 12 + parseInt(response?.prefer_time_to?.split(':')[0]),
                minute: parseInt(response?.prefer_time_to?.slice(3, 5)),
                second: 0,
              };
            }
            this.doctorConsultationDetails = response;
            this.prescriptionImg = response?.prescription;

            this.doctorConsultationForm.patchValue({
              customer_name: response?.customer_name,
              customer_email: response?.customer_email,
              customer_mobile: response?.customer_mobile,
              address_line1: response?.address_line1,
              address_line2: response?.address_line2,
              appointment_date: response?.appointment_date,
              pincode: response?.pincode,
              status: response?.status,
              specialist_type_id: response?.specialist_type_id.map(
                (mt: any) => {
                  let object: any = {
                    id: mt.id,
                    name: mt.name,
                  };
                  this.onSelectDoctorConsultationDepartment(object);
                  return object;
                },
              ),
            });

            this.onCountrySelect(101, '');
            this.doctorConsultationForm.controls['country'].setValue(101);
            this.onStateSelect(response.state_id, '');
            this.doctorConsultationForm.controls['state'].setValue(
              this.doctorConsultationDetails.state_id,
            );
            this.doctorConsultationForm.controls['city'].setValue(
              this.doctorConsultationDetails.city_id,
            );
            this.doctorConsultationForm.controls['status'].setValue(
              this.doctorConsultationDetails.status,
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
  getAllSpecialists() {
    this.specialistService.getAllSpecialistType().subscribe((response: any) => {
      this.allSpecialists = response?.map((md: any) => {
        // this.onSelectDoctorConsultationDepartment(md);
        return {
          id: md.id,
          name: md.name,
        };
      });
    });
  }
  getCountry() {
    this.doctorConsultationService.getCountry().subscribe((response: any) => {
      this.countryList = response;
    });
  }
  onSelectDoctorConsultationDepartment(service: any) {
    // console.log('looo', service);
    this.doctorConsultationDepartmentArray.push(service.id);
  }
  onDeSelectDoctorConsultationDepartment(item: any) {
    // console.log(item);
    let index = this.doctorConsultationDepartmentArray.findIndex(
      (id: any) => id == item.ward_no,
    );
    this.doctorConsultationDepartmentArray.splice(index, 1);
    if (this.doctorConsultationDepartmentArray.length === 0) {
      // this.surveyFilterForm.reset();
      this.getAllSpecialists();
    }
  }
  onPrescriptionUpload(uploadedFile: any) {
    this.prescriptionImg = uploadedFile.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.prescriptionImg);

    reader.onload = (_event) => {
      this.prescriptionUrl = reader.result;
    };
  }
  onCountrySelect(country_id?: any, type?: any) {
    const countryId =
      country_id == '' || country_id == undefined
        ? this.doctorConsultationForm.value['country']
        : country_id;
    // console.log('==============>>>>', countryId);
    if (countryId != 0) {
      // console.log('cccccc', countryId);

      this.doctorConsultationService
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
    const state_id =
      stateId == '' || stateId == undefined
        ? this.doctorConsultationForm.value['state']
        : stateId;
    if (state_id != 0) {
      this.doctorConsultationService
        .getCitiesByStateId(state_id)
        .subscribe((response: any) => {
          this.cities = response?.data;
          if (type == 'init') {
            // this.updateField(this.Details);
          }
        });
    }
  }

  onAdd() {
    // console.log('pres', this.prescriptionImg);

    const formValue: any = this.doctorConsultationForm?.value;
    // console.log('this', formValue);
    let fd = new FormData();
    let time = this.doctorConsultationForm.value['prefer_time_from'];
    let preferredTimeFrom = '';
    if (time.hour > 12) {
      preferredTimeFrom = time.hour - 12 + ':' + time.minute + ' ' + 'PM';
    } else {
      preferredTimeFrom = time.hour + ':' + time.minute + ' ' + 'AM';
    }
    let time2 = this.doctorConsultationForm.value['prefer_time_to'];
    let preferredTimeTo = '';
    if (time2.hour > 12) {
      preferredTimeTo = time2.hour - 12 + ':' + time2.minute + ' ' + 'PM';
    } else {
      preferredTimeTo = time2.hour + ':' + time2.minute + ' ' + 'AM';
    }
    let specialistType =
      this.doctorConsultationDepartmentArray.length > 0
        ? this.doctorConsultationDepartmentArray.toString()
        : '1';
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
    fd.append('appointment_date', formValue['appointment_date']);
    fd.append('prefer_time_from', preferredTimeFrom);
    fd.append('prefer_time_to', preferredTimeTo);
    fd.append('specialist_type_id', specialistType);

    fd.append('prescription', this.prescriptionImg);

    // console.log('FD', formValue);
    if (this.doctorConsultationId === 0) {
      this.doctorConsultationService
        .saveDoctorConsultation(fd)
        .subscribe((response: any) => {
          // console.log('response', response);
          if (response?.success) {
            this.toaster.success(response?.message);
            // this.message = response?.message;
            setTimeout(() => {
              // this.message = '';
              this.doctorConsultationForm.reset();
              this.router.navigateByUrl('/admin/doctor-consultation');
            }, 2000);
          }
        });
    } else {
      // console.log('FUD', formValue);

      this.doctorConsultationService
        .updateDoctorConsultation(this.doctorConsultationId, fd)
        .subscribe((response: any) => {
          // console.log('response', response);
          if (response?.success) {
            this.toaster.success(response?.message);

            // this.message = response?.message;
            setTimeout(() => {
              // this.message = '';
              this.doctorConsultationForm.reset();
              this.router.navigateByUrl('/admin/doctor-consultation');
            }, 2000);
          }
        });
    }
  }

  breadCrumbDetails() {
    if (
      this.router.url === '/admin/doctor-consultation/add-doctor-consultation'
    ) {
      this.breadCrumbData = {
        heading: 'Add Doctor Consultation',
        routing: [
          {
            routerHeading: 'doctor-consultation',
            routerLink: '/admin/doctor-consultation',
          },
          {
            routerHeading: 'add-doctor-consultation',
            routerLink: '/admin/doctor-consultation/add-doctor-consultation',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'Edit Doctor Consultation',
        routing: [
          {
            routerHeading: 'doctor consultation',
            routerLink: '/admin/doctor-consultation',
          },
          {
            routerHeading: 'edit-doctor-consultation',
            routerLink: '/admin/doctor-consultation/edit-doctor-consultation',
          },
        ],
      };
    }
  }
  get customer_name() {
    return this.doctorConsultationForm.get('customer_name');
  }
  get customer_email() {
    return this.doctorConsultationForm.get('customer_email');
  }
  get customer_mobile() {
    return this.doctorConsultationForm.get('customer_mobile');
  }
  get address_line1() {
    return this.doctorConsultationForm.get('address_line1');
  }
  get address_line2() {
    return this.doctorConsultationForm.get('address_line2');
  }
  get country() {
    return this.doctorConsultationForm.get('country');
  }
  get state() {
    return this.doctorConsultationForm.get('state_id');
  }
  get city() {
    return this.doctorConsultationForm.get('city_id');
  }
  get pincode() {
    return this.doctorConsultationForm.get('pincode');
  }
  get specialist_type_id() {
    return this.doctorConsultationForm.get('specialist_type_id');
  }
}
