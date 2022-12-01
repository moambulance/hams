import { SaveMedtelOrder } from './iot.model';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AmbulanceService } from '../ambulance/ambulance.service';
import { HospitalService } from '../hospitals/hospital.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { IotService } from './iot.service';
import { IotCompaniesService } from './iot-companies/iot-companies.service';
declare var Razorpay: any;
@Component({
  selector: 'app-iot',
  templateUrl: './iot.component.html',
  styleUrls: ['./iot.component.css'],
})
export class IotComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Iot',
    routing: [{ routerHeading: 'Iot', routerLink: '/admin/iot' }],
  };
  customerPatientAddForm: FormGroup;
  sufferingFromDetails: any;
  // customerForm!: FormGroup;
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,4}$';
  sufferingFromValue!: string;
  phoneNumber!: string | Blob;
  sidebarLoaderText!: string;

  patientField: boolean = true;
  isIotServices: boolean = false;
  isPaymentScreen: boolean = false;
  // patientField: boolean = true;
  // isIotServices: boolean = false;
  patientDetails: any;
  mobileNumber: string = '';
  mobileNoExist: boolean = true;
  // RazorPay

  rzp_api_key: string = environment.RAZORPAY_DEMO_KEY;
  options = {
    description: '',
    currency: '',
    key: '',
    amount: 0,
    name: '',
    prefill: {
      email: '',
      contact: '',
      name: '',
    },
    handler: (response: any) => response,
  };
  patientId: any = 0;
  allTest: any;
  testData: any = [];
  testIds: any = [];
  fareData: any;
  razorpayId: any;
  activeCompanies: any;
  // selectedTest: any = [];

  // End Of Razorpay
  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private ambulanceService: AmbulanceService,
    private spinner: NgxSpinnerService,
    private iotService: IotService,
    private iotCompanyervice: IotCompaniesService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.customerPatientAddForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+$')]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          ),
          ,
        ],
      ],
      sufferingFrom: ['', [Validators.required]],
      p_address: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
      height: ['', [Validators.required]],
      // inch: ['', [Validators.required]],
      weight: ['', [Validators.required]],
    });
    this.customerPatientAddForm.controls['sufferingFrom'].setValue(0);
  }

  ngOnInit(): void {
    this.getAllTests();
    /*     this.iotCompanyervice.getActiveIotCompanies().subscribe((res: any) => {
      this.activeCompanies = res.data;
      console.log('====================================');
      console.log(res);
      console.log('====================================');
    }); */
  }
  onAddPatientCustomer() {
    const d = new Date();
    // 2022 - 07 - 05;
    let year = d.getFullYear();
    let age =
      year - new Date(this.customerPatientAddForm.value['age']).getFullYear();
    console.log(this.customerPatientAddForm.value['age']);
    // return;

    let patientData = new FormData();
    patientData.append('name', this.customerPatientAddForm.value['name']);
    patientData.append('age', age.toString());
    patientData.append('suffering_from_id', this.sufferingFromValue);
    patientData.append('gender', this.customerPatientAddForm.value['gender']);
    patientData.append('phone', this.mobileNumber);
    patientData.append('email', this.customerPatientAddForm.value['email']);
    patientData.append(
      'p_address',
      this.customerPatientAddForm.value['p_address'],
    );
    patientData.append('weight', this.customerPatientAddForm.value['weight']);
    patientData.append('height', this.customerPatientAddForm.value['height']);
    this.sidebarLoaderText = 'Saving Patient Details';

    let medtelData = new FormData();
    medtelData.append('access_token', 'a3afc0c8a929baf26fc9d3d58da9854c');
    medtelData.append('thp_id', '659c061cb58f90e5f0d722c3e43867af');
    medtelData.append(
      'patient_name',
      this.customerPatientAddForm.value['name'],
    );
    // patientData.append('gender', this.customerPatientAddForm.value['gender']);
    medtelData.append('mobile',  this.mobileNumber);
    medtelData.append('gender', this.customerPatientAddForm.value['gender']);
    medtelData.append('age', age.toString());
    medtelData.append('height', this.customerPatientAddForm.value['height']);
    medtelData.append('weight', this.customerPatientAddForm.value['weight']);

    this.iotService.patientRegistraion(medtelData).subscribe(
      (result: any) => {
    console.log('Medtel', result);
    if (this.patientId != 0) {
      this.iotService.patientUpdate(this.patientId, patientData).subscribe(
        (response: any) => {
          if (response.success) {
            this.toastr.success(response.message);
            this.patientField = false;
            this.isIotServices = true;
            // this.patientDetails = response.data;
            this.getAllTests();
            this.customerPatientAddForm.reset();
          } else {
            this.toastr.error(response.message);
          }
        },
        (error: any) => {
          console.log(error);
        },
      );
    } else {
      this.ambulanceService.addPatient(patientData).subscribe(
        (response: any) => {
          console.log('====================================');
          console.log(response);
          console.log('====================================');
          if (response.success) {
            this.toastr.success(response.message);
            this.patientField = false;
            this.patientId = response.data.id;
            this.isIotServices = true;
            this.patientDetails = response.data;
            this.customerPatientAddForm.reset();
          } else {
            this.toastr.error(response.message);
          }
        },
        (error: any) => {
          console.log(error);
        },
      );
    }
      },
      (error: any) => {
        console.log(error);
      },
    );
  }
  mobileNumberPatch(event: any): any {
    console.log('====================================');
    console.log(event);
    console.log('====================================');
    if (!Number(event.target.value)) {
      this.mobileNoExist = true;
      return false;
    }

    if (event.target.value.length === 10) {
      this.mobileNoExist = false;
      this.mobileNumber = event.target.value;
      this.ambulanceService
        .getPatientDetailsByMobile(event.target.value)
        .subscribe((response: any) => {
          this.patientDetails = response.data;
          this.patientId = response.data.id;
          console.log('response', response.data);
          if (response.success) {
            const d = new Date();
            let year = d.getFullYear() - this.patientDetails.age;
            this.patientId = this.patientDetails.id;
            // console.log('====================================');
            // console.log(year);
            // console.log('====================================');
            this.customerPatientAddForm.patchValue({
              name: this.patientDetails.name,
              email: this.patientDetails.email,
              mobile: this.patientDetails.phone,
              age: `${year}-01-01`, //2022 - 07 - 05;
              weight: this.patientDetails.weight,
              height: this.patientDetails.height,
              gender: this.patientDetails.gender,
            });

            this.mobileNoExist = true;
            this, this.toastr.warning('Number Already Exist');
          }
        });
    } else {
      this.mobileNoExist = true;
    }
  }
  getAllTests() {
    let medtelId: number = 1;
    this.iotService.getAllTestByCompanyId(medtelId).subscribe((test: any) => {
      // console.log('====================================');
      // console.log(test);
      // console.log('====================================');
      this.allTest = test.data.map((d: any) => {
        console.log(d);
        return { ...d, isSelected: false };
      });
    });
  }
  onSelectedTest(test: any) {
    console.log(this.testIds);
    test.isSelected = !test.isSelected;
    if (test.isSelected) {
      this.testIds.push(test.id);
      console.log(this.testIds);
    } else {
      let ids = this.testIds.filter((id: any) => {
        return id != test.id;
      });
      console.log(ids);
      this.testIds = ids;
    }
  }
  getTestFareDetails() {
    this.iotService.getFareDetails(this.testIds).subscribe((data: any) => {
      this.fareData = data.data;
      this.isPaymentScreen = data.success;
      this.isIotServices = !data.success;
      console.log(data);
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
      console.log(currentUrl);
    });
  }
  onDateChange() {}
  onPaymentSubmit(): void {
    this.options = {
      key: this.rzp_api_key, // Your api key
      currency: 'INR',
      name: 'Mo Ambulance',
      description: 'Mo Ambulance Fare',
      amount: 100 * +this.fareData?.fareDetails?.total_price,
      // prefill: {
      //   email: this.patientDetails.email,
      //   name: this.patientDetails.name,
      //   contact: this.patientDetails.phone,
      // },
      prefill: {
        email: 'abc@gmail.com',
        name: 'abc',
        contact: '1234567890',
      },
      handler: (response) => {
        this.razorpayId = response.razorpay_payment_id;
        return this.saveTestOrder();
      },
    };

    let rzp1 = new Razorpay(this.options);
    rzp1.open();
  }
  async saveTestOrder() {
    console.log(this.patientDetails);
    let medtelOrder: SaveMedtelOrder = {
      patient_id: this.patientId,
      company_id: 1,
      test_ids: this.testIds,
      status: this.razorpayId ? 1 : 0,
      razor_pay_details: JSON.stringify({ razorpay_id: this.razorpayId }),
    };

    this.iotService.saveFareDetails(medtelOrder).subscribe((response: any) => {
      console.log('>>>>>', response);
      if(response?.data){
        this.toastr.success("Payment Done Successfully");
        this.isPaymentScreen = false;
        this.reloadCurrentRoute();
      }else {
        this.toastr.error("Error in payment. Please try again");
      }
    });
  }
}
