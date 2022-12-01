import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TestTypeService } from '../../../master/test-type/test-type.service';

import { PathologyService } from '../../pathology/pathology.service';

@Component({
  selector: 'app-add-pathology',
  templateUrl: './add-pathology.component.html',
  styleUrls: ['./add-pathology.component.css'],
})
export class AddPathologyComponent implements OnInit {
  breadCrumbData: any;
  ShowFilter: boolean = true;

  pathologyServiceShowFilter: boolean = true;
  prescriptionImageChange: boolean = false;
  PathologyDepartmentShowFilter: boolean = true;
  deliveryForm!: FormGroup;
  countryList: any;
  stateLists: any;
  pathologyId: number = 0;
  // deliveryDetails: (deliveryList: any) => void;
  cities: any;
  baseUrl: any = environment.BASE_URL;
  prescriptionImg: any = '';
  prescriptionUrl: any;
  allTestType: any;
  testTypeDropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    enableCheckAll: false,
    allowSearchFilter: this.PathologyDepartmentShowFilter,
  };

  // pathologyServiceDropdownSettings: any = {
  //   singleSelection: false,
  //   idField: 'id',
  //   textField: 'name',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   // itemsShowLimit: 3,
  //   enableCheckAll: false,
  //   allowSearchFilter: this.pathologyServiceShowFilter,
  // };

  // PathologyDepartmentDropdownSettings: any = {
  //   singleSelection: false,
  //   idField: 'id',
  //   textField: 'name',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   // itemsShowLimit: 3,
  //   enableCheckAll: false,
  //   allowSearchFilter: this.PathologyDepartmentShowFilter,
  // };
  pathologyDepartmentArray: any = [];
  pathologyDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private pathologyService: PathologyService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private testTypeService: TestTypeService,
  ) {
    this.deliveryForm = this.formBuilder.group({
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
      prefered_delivery: ['', [Validators.required]],
      test_type_id: ['', [Validators.required]],
      status: ['', [Validators.required]],
      created_by: [1],
      prescription: ['', [Validators.required]],
    });

    this.deliveryForm.controls['country'].setValue(0);
    this.deliveryForm.controls['state'].setValue(0);
    this.deliveryForm.controls['city'].setValue(0);
    this.deliveryForm.controls['status'].setValue(-1);
  }
  ngOnInit(): void {
    this.showSpinner();
    this.breadCrumbDetails();
    this.getAllTestType();
    this.getPathologyId();
  }
  // pathology edit patch values
  getPathologyId() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pathologyId = Number(params.get('id'));
      console.log('id', this.pathologyId);

      if (this.pathologyId !== 0) {
        this.pathologyService
          .getPathologyById(this.pathologyId)
          .subscribe((response: any) => {
            console.log('res', typeof response?.test_type_id);
            console.log('response++++++++++++', response);
            this.prescriptionUrl = this.baseUrl + response?.prescription;
            this.pathologyDetails = response;
            this.deliveryForm.patchValue({
              customer_name: response?.customer_name,
              customer_email: response?.customer_email,
              customer_mobile: response?.customer_mobile,
              address_line1: response?.address_line1,
              address_line2: response?.address_line2,
              prefered_delivery: response?.prefered_delivery,
              pincode: response?.pincode,
              status: response?.status,

              test_type_id: response?.test_type_id.map((mt: any) => {
                let object: any = {
                  id: mt.id,
                  name: mt.name,
                };
                console.log('mtttt', object);
                this.onSelectPathologyDepartment(object);
                return object;
              }),
            });

            this.onCountrySelect(101, '');
            this.deliveryForm.controls['country'].setValue(101);
            this.onStateSelect(response.state, '');
            this.deliveryForm.controls['state'].setValue(
              this.pathologyDetails.state_id,
            );
            this.onStateSelect(this.pathologyDetails.state_id, '');
            this.deliveryForm.controls['city'].setValue(
              this.pathologyDetails.city_id,
            );
            this.prescriptionImg = response?.prescription;
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
  getAllTestType() {
    this.testTypeService.getAllTestType().subscribe((response: any) => {
      this.allTestType = response?.map((md: any) => {
        return {
          id: md.id,
          name: md.name,
        };
      });
    });
  }
  getCountry() {
    this.pathologyService.getCountry().subscribe((response: any) => {
      this.countryList = response;
    });
  }
  onSelectPathologyDepartment(service: any) {
    this.pathologyDepartmentArray.push(service.id);
    console.log('vzxv', this.pathologyDepartmentArray);
    this.pathologyDepartmentArray.sort((a: any, b: any) => {
      return a - b;
    });
    console.log('vzxv', this.pathologyDepartmentArray);
  }
  onDeSelectPathologyDepartment(item: any) {
    console.log(item);
    let ids: any = this.pathologyDepartmentArray;
    this.pathologyDepartmentArray = [];
    ids.filter((data: any) => {
      if (data !== item.id) {
        this.pathologyDepartmentArray.push(data);
      }
    });
    console.log(this.pathologyDepartmentArray);

    // let index = this.pathologyDepartmentArray.findIndex(
    //   (id: any) => id == item.ward_no,
    // );
    // this.pathologyDepartmentArray.splice(index, 1);
    if (this.pathologyDepartmentArray.length === 0) {
      // this.surveyFilterForm.reset();
      this.getAllTestType();
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
        ? this.deliveryForm.value['country']
        : country_id;
    console.log('==============>>>>', countryId);
    if (countryId != 0) {
      console.log('cccccc', countryId);

      this.pathologyService
        .getStateByCountryId(countryId)
        .subscribe((response: any) => {
          this.stateLists = response?.data;
          // if (type == 'init') {
          //   this.updateDeliveryField(this.deliveryList);
          // }
        });
    }
  }
  // updateDeliveryField(deliveryList: any) {
  //   console.log('ff', deliveryList);
  // }
  // deliveryList(deliveryList: any) {
  //   throw new Error('Method not implemented.');
  // }

  onStateSelect(stateId?: any, type?: any) {
    const state =
      stateId == '' || stateId == undefined
        ? this.deliveryForm.value['state']
        : stateId;
    if (state != 0) {
      this.pathologyService
        .getCitiesByStateId(state)
        .subscribe((response: any) => {
          this.cities = response?.data;
          if (type == 'init') {
            // this.updateDeliveryField(this.deliveryDetails);
          }
        });
    }
  }
  onAddDelivery() {
    const formValue: any = this.deliveryForm?.value;
    console.log('this', formValue);
    let fd = new FormData();

    // const fd = new FormData();
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
    fd.append('prefered_delivery', formValue['prefered_delivery']);
    fd.append('test_type_id', this.pathologyDepartmentArray.toString());

    fd.append('prescription', this.prescriptionImg);

    console.log('FD', formValue);
    if (this.pathologyId === 0) {
      this.pathologyService.savePathology(fd).subscribe((response: any) => {
        console.log('response', response);
        if (response?.success) {
          this.toaster.success(response.message);
          // this.message = response?.message;
          setTimeout(() => {
            // this.message = '';
            this.deliveryForm.reset();
            this.router.navigateByUrl('/admin/pathology');
          }, 2000);
        }
      });
    } else {
      console.log('FUD', formValue);

      this.pathologyService
        .updatePathology(this.pathologyId, fd)
        .subscribe((response: any) => {
          console.log('response', response);
          if (response?.success) {
            this.toaster.success(response.message);
            // this.message = response?.message;
            setTimeout(() => {
              // this.message = '';
              this.deliveryForm.reset();
              this.router.navigateByUrl('/admin/pathology');
            }, 2000);
          }
        });
    }
  }

  breadCrumbDetails() {
    if (this.router.url === '/admin/pathology/add-pathology') {
      this.breadCrumbData = {
        heading: 'Add Pathology',
        routing: [
          {
            routerHeading: 'pathology',
            routerLink: '/admin/pathology',
          },
          {
            routerHeading: 'add-pathology',
            routerLink: '/admin/pathology/add-pathology',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'Edit Pathology',
        routing: [
          {
            routerHeading: 'pathology',
            routerLink: '/admin/pathology',
          },
          {
            routerHeading: 'edit-pathology',
            routerLink: '/admin/pathology/edit-pathology',
          },
        ],
      };
    }
  }
  get customer_name() {
    return this.deliveryForm.get('customer_name');
  }
  get customer_email() {
    return this.deliveryForm.get('customer_email');
  }
  get customer_mobile() {
    return this.deliveryForm.get('customer_mobile');
  }
  get address_line1() {
    return this.deliveryForm.get('address_line1');
  }
  get address_line2() {
    return this.deliveryForm.get('address_line2');
  }
  get country() {
    return this.deliveryForm.get('country');
  }
  get state() {
    return this.deliveryForm.get('state');
  }
  get city() {
    return this.deliveryForm.get('city_id');
  }
  get pincode() {
    return this.deliveryForm.get('pincode');
  }
}
