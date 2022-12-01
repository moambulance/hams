import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MedicinesService } from '../../../master/medicines/medicines.service';
import { MedicineDeliveryService } from '../medicine-delivery.service';

@Component({
  selector: 'app-add-medicine-delivery',
  templateUrl: './add-medicine-delivery.component.html',
  styleUrls: ['./add-medicine-delivery.component.css'],
})
export class AddMedicineDeliveryComponent implements OnInit {
  breadCrumbData: any;
  ShowFilter: boolean = true;

  medicineServiceShowFilter: boolean = true;
  prescriptionImageChange: boolean = false;
  medicineDepartmentShowFilter: boolean = true;
  deliveryForm!: FormGroup;
  countryList: any;
  stateLists: any;
  medicineId: number = 0;
  // deliveryDetails: (deliveryList: any) => void;
  cities: any;
  prescriptionImg: any = '';
  prescriptionUrl: any;
  allMedicines: any;
  medicineTypeDropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    enableCheckAll: false,
    allowSearchFilter: this.ShowFilter,
  };

  medicineServiceDropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    enableCheckAll: false,
    allowSearchFilter: this.medicineServiceShowFilter,
  };

  medicineDepartmentDropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    enableCheckAll: false,
    allowSearchFilter: this.medicineDepartmentShowFilter,
  };
  medicineDepartmentArray: any = [];
  medicineDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private medicineService: MedicinesService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private medicineDeliveryService: MedicineDeliveryService,
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
      expected_delivery: ['', [Validators.required]],
      medicine_ids: ['', [Validators.required]],
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
    this.getAllMedicine();
    this.getMedicineId();
  }
  // medicine edit patch values
  getMedicineId() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.medicineId = Number(params.get('id'));
      console.log('id', this.medicineId);

      if (this.medicineId) {
        this.medicineDeliveryService
          .getAllMedicineDeliveryById(this.medicineId)
          .subscribe((response: any) => {
            console.log('response++++++++++++', response);

            this.medicineDetails = response;
            this.deliveryForm.patchValue({
              customer_name: response?.customer_name,
              customer_email: response?.customer_email,
              customer_mobile: response?.customer_mobile,
              address_line1: response?.address_line1,
              address_line2: response?.address_line2,
              expected_delivery: response?.expected_delivery,
              pincode: response?.pincode,
              status: response?.status,
              medicine_ids: response?.medicine_ids.map((mt: any) => {
                console.log('mtttt', mt);
                let object: any = {
                  id: mt.id,
                  name: mt.name,
                };
                this.onSelectMedicineDepartment(object);
                return object;
              }),
            });

            this.onCountrySelect(101, '');
            this.deliveryForm.controls['country'].setValue(101);
            this.onStateSelect(response.state_id, '');
            this.deliveryForm.controls['state'].setValue(
              this.medicineDetails.state_id,
            );
            this.deliveryForm.controls['city'].setValue(
              this.medicineDetails.city_id,
            );
            this.prescriptionUrl = response?.prescription;
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
  getAllMedicine() {
    this.medicineService.getAllMedicine().subscribe((response: any) => {
      this.allMedicines = response?.map((md: any) => {
        return {
          id: md.id,
          name: md.name,
        };
      });
    });
  }
  getCountry() {
    this.medicineDeliveryService.getCountry().subscribe((response: any) => {
      this.countryList = response;
    });
  }
  onSelectMedicineDepartment(service: any) {
    console.log('looo', service);
    this.medicineDepartmentArray.push(service.id);
  }
  onDeSelectMedicineDepartment(item: any) {
    console.log(item);
    let index = this.medicineDepartmentArray.findIndex(
      (id: any) => id == item.ward_no,
    );
    this.medicineDepartmentArray.splice(index, 1);
    if (this.medicineDepartmentArray.length === 0) {
      // this.surveyFilterForm.reset();
      this.getAllMedicine();
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

      this.medicineDeliveryService
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
    const state_id =
      stateId == '' || stateId == undefined
        ? this.deliveryForm.value['state']
        : stateId;
    if (state_id != 0) {
      this.medicineDeliveryService
        .getCitiesByStateId(state_id)
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
    fd.append('expected_delivery', formValue['expected_delivery']);
    fd.append('medicine_ids', this.medicineDepartmentArray.toString());

    fd.append('prescription', this.prescriptionImg);

    console.log('FD', formValue);
    if (this.medicineId === 0) {
      this.medicineDeliveryService
        .saveAllMedicineDelivery(fd)
        .subscribe((response: any) => {
          console.log('response', response);
          if (response?.success) {
            this.toaster.success(response.message);
            // this.message = response?.message;
            setTimeout(() => {
              // this.message = '';
              this.deliveryForm.reset();
              this.router.navigateByUrl('/admin/medicine-delivery');
            }, 2000);
          }
        });
    } else {
      console.log('FUD', formValue);

      this.medicineDeliveryService
        .updateMedicineDelivery(this.medicineId, fd)
        .subscribe((response: any) => {
          console.log('response', response);
          if (response?.success) {
            // this.message = response?.message;
            this.toaster.success(response.message);

            setTimeout(() => {
              // this.message = '';
              this.deliveryForm.reset();
              this.router.navigateByUrl('/admin/medicine-delivery');
            }, 2000);
          }
        });
    }
  }

  breadCrumbDetails() {
    if (this.router.url === '/admin/medicine-delivery/add-medicine-delivery') {
      this.breadCrumbData = {
        heading: 'Add Medicine Delivery',
        routing: [
          {
            routerHeading: 'medicine-delivery',
            routerLink: '/admin/medicine-delivery',
          },
          {
            routerHeading: 'add-medicine-delivery',
            routerLink: '/admin/medicine-delivery/add-medicine-delivery',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'Edit Medicine Melivery',
        routing: [
          {
            routerHeading: 'medicine-delivery',
            routerLink: '/admin/medicine-delivery',
          },
          {
            routerHeading: 'edit-medicine-delivery',
            routerLink: '/admin/medicine-delivery/edit-medicine-delivery',
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
    return this.deliveryForm.get('state_id');
  }
  get city() {
    return this.deliveryForm.get('city_id');
  }
  get pincode() {
    return this.deliveryForm.get('pincode');
  }
}
