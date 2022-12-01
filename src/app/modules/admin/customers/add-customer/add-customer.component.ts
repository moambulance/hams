import { get } from 'jquery';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent implements OnInit {
  customerAddForm: any;
  isImageChange: boolean = false;
  profileImageBrowse: any;
  @ViewChild('profileImageFile') profileImage!: ElementRef;
  customerId: any;
  customerDetails: any;
  customerImage: any;
  baseUrl: string = environment.BASE_URL;
  message: any;
  breadCrumbData: any = {
    heading: 'Edit Customer',
    routing: [
      {
        routerHeading: 'customers',
        routerLink: '/admin/customers',
      },
      {
        routerHeading: 'edit-customer',
        routerLink: 'customers/edit-customers',
      },
    ],
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
  ) {
    this.customerAddForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      country_code: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      fcm: [''],
      c_address: [''],
      status: [''],
      profile_image: [''],
    });
    this.customerAddForm.controls['status'].setValue(-1);
  }

  ngOnInit(): void {
    this.showSpinner();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.customerId = Number(params.get('id'));
      this.customerService
        .getCustomerById(this.customerId)
        .subscribe((response: any) => {
          console.log('response', response);

          this.customerDetails = response;
          this.customerImage = response.profile_image;
          this.updatecustomerField(this.customerDetails);
        });
    });
  }
  updatecustomerField(customerDetails: any) {
    this.customerAddForm.patchValue({
      first_name: customerDetails.first_name,
      last_name: customerDetails.last_name,
      country_code: customerDetails.country_code,
      email: customerDetails.email,
      phone: customerDetails.phone,
      latitude: customerDetails.latitude,
      longitude: customerDetails.longitude,
      c_address: customerDetails.c_address,
      fcm: customerDetails.fcm,
    });
    this.customerAddForm.controls['status'].setValue(customerDetails.is_active);
    console.log('this.customerImage', this.customerImage);

    this.profileImageBrowse = this.baseUrl + this.customerImage;
  }

  onProfileImageChange(file: any) {
    if (this.customerId != '') {
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

  onAddCustomer() {
    if (this.customerId) {
      let fd = new FormData();
      fd.append('first_name', this.customerAddForm.value['first_name']);
      fd.append('last_name', this.customerAddForm.value['last_name']);
      fd.append('email', this.customerAddForm.value['email']);
      fd.append('phone', this.customerAddForm.value['phone']);
      fd.append('country_code', this.customerAddForm.value['country_code']);
      fd.append('lat', this.customerAddForm.value['latitude']);
      fd.append('lon', this.customerAddForm.value['longitude']);
      fd.append('c_address', this.customerAddForm.value['c_address']);
      fd.append('fcm', this.customerAddForm.value['fcm']);
      fd.append('is_active', this.customerAddForm.value['status']);
      let file = this.profileImage.nativeElement.files[0];
      fd.append(
        'profile_image',
        this.isImageChange == true ? file : this.customerImage,
      );
      this.customerService
        .updateCustomer(this.customerId, fd)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            setTimeout(() => {
              this.message = '';
              this.router.navigateByUrl('/admin/customers');
            }, 2000);
          }
        });
    } else {
      const save_date = {
        first_name: this.customerAddForm.value['first_name'],
        last_name: this.customerAddForm.value['last_name'],
        email: this.customerAddForm.value['email'],
        phone: this.customerAddForm.value['phone'],
        country_code: this.customerAddForm.value['country_code'],
        lat: this.customerAddForm.value['lat'],
        lon: this.customerAddForm.value['lon'],
        c_address: this.customerAddForm.value['c_address'],
        fcm: this.customerAddForm.value['fcm'],
        is_active: this.customerAddForm.value['is_active'],
        profile_image: this.customerAddForm.value['profile_image'],
      };
      this.customerService
        .createCusomer(save_date)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            setTimeout(() => {
              this.message = '';
              this.router.navigateByUrl('/admin/customers');
            }, 2000);
          }
        });
    }
  }
  get phone() {
    return this.customerAddForm.get('phone');
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
}
