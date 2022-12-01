import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IotCompaniesService } from './iot-companies.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-iot-companies',
  templateUrl: './iot-companies.component.html',
  styleUrls: ['./iot-companies.component.css'],
})
export class IotCompaniesComponent implements OnInit {
  @ViewChild('companyForm') companyForm!: ElementRef;

  breadCrumbData: any = {
    heading: 'Iot Companies',
    routing: [
      { routerHeading: 'Iot Companies', routerLink: '/admin/iot-companies' },
    ],
  };
  allCompaniesList: any;
  iotCompanyAddForm!: FormGroup;
  // companyDetails: any;
  companyId: any = 0;
  // isImageChange: boolean =false;
  profileImageBrowse: any = '';
  isBtnLoading: boolean = false;
  buttonType: string = 'Save';
  message: any;
  is_Active: any = 0;
  baseUrl: any = environment.BASE_URL;
  profileImageUrl: any;

  constructor(
    private iotCompaniesService: IotCompaniesService,
    private formBuilder: FormBuilder,
  ) {
    this.iotCompanyAddForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      company_customised_price: ['', [Validators.required]],
      company_image: ['', [Validators.required]],
      is_customised_price: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAllCompanies();
  }
  onCustomisedPrice(event: any) {
    let customisedPrice = event.target.value;
    if (
      customisedPrice > 100 ||
      customisedPrice < 0 ||
      customisedPrice.toString().includes('-') ||
      !parseInt(customisedPrice)
    ) {
      event.target.value = 0;
    }
  }
  getAllCompanies() {
    this.iotCompaniesService.getIotCompanies().subscribe((response: any) => {
      console.log(response);
      this.allCompaniesList = response.data;
    });
  }
  // onAddTestType() {}
  onEdit(company: any) {
    console.log(company);
    this.buttonType = 'Update';
    this.profileImageBrowse = company.company_image;
    // this.companyDetails = company
    console.log(company.is_customised_pric);
    this.is_Active = company.status;
    this.companyId = company.id;
    this.iotCompanyAddForm.patchValue({
      name: company.name,
      status: company.status,
      company_customised_price: company.company_customised_price,

      is_customised_price: +company.is_customised_price,
      // company_image: company.company_image,
    });
  }

  //  For Update And Create Company
  onSave() {
    this.isBtnLoading = true;
    let data = new FormData();
    data.append('name', this.iotCompanyAddForm.value['name']);
    data.append(
      'company_customised_price',
      this.iotCompanyAddForm.value['company_customised_price'],
    );
    data.append('company_image', this.profileImageBrowse);
    data.append(
      'is_customised_price',
      this.iotCompanyAddForm.value['is_customised_price'],
    );
    data.append('status', this.is_Active);

    if (this.companyId > 0) {
      this.iotCompaniesService
        .updateCompanyById(this.companyId, data)
        .subscribe((response: any) => {
          this.message = response.message;
          setTimeout(() => {
            this.closeCompanyForm();
            this.getAllCompanies();
          }, 2000);
        });
    } else {
      this.iotCompaniesService.saveCompany(data).subscribe((response: any) => {
        this.message = response.message;
        setTimeout(() => {
          this.closeCompanyForm();
          this.getAllCompanies();
        }, 2000);
      });
    }
  }
  onActiveChange(event: any) {
    console.log('====================================');
    // console.log(event.target.checked);
    this.is_Active = event.target.checked ? 1 : 0;
    // console.log('====================================', this.is_Active);
  }
  onStatusChange(type: any, company: any) {
    if (type == 'customPrice') {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update it!',
      }).then((result: any) => {
        if (result.isConfirmed) {
          let customised: any = {
            is_customised_price:
              company && company.is_customised_price == 1 ? 0 : 1,
          };
          this.iotCompaniesService
            .updateisCustomisedById(company.id, customised)
            .subscribe((response: any) => {
              console.log('re', response);

              this.getAllCompanies();
            });
          Swal.fire('Updated!', 'Your Status has been updated.', 'success');
        } else {
          this.getAllCompanies();
        }
      });
    } else if (type == 'status') {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update it!',
      }).then((result: any) => {
        if (result.isConfirmed) {
          let status: any = {
            status: company && company.status == 1 ? 0 : 1,
          };
          this.iotCompaniesService
            .updateStatusByCompaniesById(company.id, status)
            .subscribe((response: any) => {
              console.log('re', response);
              this.getAllCompanies();
            });

          Swal.fire('Updated!', 'Your Status has been updated.', 'success');
        } else {
          this.getAllCompanies();
        }
      });
    }
  }
  // For Image
  onProfileImageChange(file: any) {
    console.log('====================================');
    console.log(file);
    console.log('====================================');
    if (file.target.files && file.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);
      this.profileImageBrowse = file.target.files[0];
      console.log(this.profileImageBrowse);
    }
  }
  onDeleteCompany(company: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.iotCompaniesService
          .deleteIotCompaniesById(company.id)
          .subscribe((response: any) => {
            console.log(response);
            this.getAllCompanies();
          });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
  closeCompanyForm() {
    this.message = '';
    this.companyId = 0;
    this.buttonType = 'Save';
    this.isBtnLoading = false;
    this.companyForm.nativeElement.click();
  }
  get name() {
    return this.iotCompanyAddForm.get('name');
  }
  // get company_image() {
  //   return this.ambulanceForm.get('registration_number');
  // }
  // get status() {
  //   return this.ambulanceForm.get('status');
  // }
  // get hospital_id() {
  //   return this.ambulanceForm.get('hospital_id');
  // }

  // get ambulance_type_id() {
  //   return this.ambulanceForm.get('ambulance_type_id');
  // }
}
