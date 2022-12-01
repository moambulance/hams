import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { PatientVitalsComponent } from 'src/app/components/patient-vitals/patient-vitals.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SaveMedtelOrder } from '../../admin/iot/iot.model';
import { IotService } from '../../admin/iot/iot.service';
import { AmbulanceService } from '../ambulance/ambulance.service';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-mhu-dashboard',
  templateUrl: './mhu-dashboard.component.html',
  styleUrls: ['./mhu-dashboard.component.css']
})
export class MhuDashboardComponent implements OnInit {
  activeIotCompanyId: number = 0;
  patients: Array<any> = [];
  patientForm: FormGroup;
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,4}$';
  patientField: boolean = true;
  isIotServices: boolean = false;
  isPaymentScreen: boolean = false;
  patientDetails: any;
  mobileNumber: string = '';
  mobileNoExist: boolean = true;
  sufferingFromValue!: string;
  phoneNumber!: string | Blob;
  patientId: any = 0;
  allTest: any;
  testData: any = [];
  testIds: any = [];
  showNextBtnLoader: boolean = false;
  isNewPatient: boolean = false;
  fareData: any;
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
  razorpayId: any;
  assignedIotCompanies: Array<any> = [];
  userId: number = 0;
  selectedIotCompany: any = {};
  ezeRxToken: string = "";
  @ViewChild('patientVitalsOverlay') public patientVitalsOverlay!: ElementRef;
  @ViewChild(PatientVitalsComponent) patientVitalComponent!: PatientVitalsComponent;
  @ViewChild('closeModal') public closeModal!: ElementRef;
  @ViewChild('patientAddModal') patientAddModal!: ElementRef;
  @ViewChild('iotCompanyModal') iotCompanyModal!: ElementRef;
  @ViewChild('closeIotCompanyModal') public closeIotCompanyModal!: ElementRef;

  constructor(private authService: AuthService,
    private hospitalService: HospitalService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private iotService: IotService,
    private ambulanceService: AmbulanceService) {
    this.patientForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+$')]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: ['',
        [
          Validators.required,
          Validators.pattern(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          )
        ]
      ],
      sufferingFrom: ['', [Validators.required]],
      p_address: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
      height: ['', [Validators.required]],
      // inch: ['', [Validators.required]],
      weight: ['', [Validators.required]],
    });
    this.patientForm.controls['sufferingFrom'].setValue(0);
  }

  ngOnInit(): void {
    this.getIotCompaniesByUserId();
  }

  getIotCompaniesByUserId() {
    const user = this.authService.getLogedInUserDetails();
    console.log("user ", user);
    this.userId = user.user_id;
    this.hospitalService.getMvitalUserDetailsById(this.userId).subscribe((response: any) => {
      // console.log("response :: ", response);
      if (response?.iot_company_details && response?.iot_company_details.length > 0) {
        this.assignedIotCompanies = response?.iot_company_details.map((iotCompany: any, index: number) => {
          return {
            ...iotCompany,
            isSelected: index == 0 ? true : false
          }
        });
        this.activeIotCompanyId = this.assignedIotCompanies[0].id;
        this.getPatientsByMvitalUserId();
      } else {
        this.toastr.error("No IOT Device has been assigned. Contact to admin.");
      }
    });
  }

  getPatientsByMvitalUserId() {
    this.hospitalService.getPatientsByMvitalUser(this.userId)
      .subscribe((response: any) => {
        this.patients = response;
        console.log("this.patients ", this.patients);
      });
  }

  onRefreshPatients() {
    this.getPatientsByMvitalUserId();
  }

  showPatientVitalsOverlay(index: number) {
    const patient = this.patients[index];
    // console.log("patient ", patient);
    if (patient?.medtel_iot.length > 0) {
      this.patientVitalComponent.onParentEventReceived(patient?.medtel_iot);
      this.patientVitalsOverlay.nativeElement.style.width = "100%";
    } else {
      this.toastr.warning("Reports has not been updated for this patient");
      this.patientVitalsOverlay.nativeElement.style.width = "0%";
    }
  }

  onClosePatientVitalsOverlay(event: any) {
    this.patientVitalsOverlay.nativeElement.style.width = "0%";
  }

  onLogout() {
    Swal.fire({
      title: 'Do you want to logout from M-Vitals?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.onMvitalsLogout();
      }
    });
  }

  bookPatient() {
    this.iotCompanyModal.nativeElement.click();
  }

  onIotCompanySelect(index: number) {
    this.selectedIotCompany = this.assignedIotCompanies[index];
    this.assignedIotCompanies.map((company: any, i: number) => {
      if (i == index) {
        company.isSelected = true;
      } else {
        company.isSelected = false;
      }
    });
    this.onAddPatientClick();
  }

  onAddPatientClick() {
    this.patientAddModal.nativeElement.click();
    this.patientField = true;
    this.isIotServices = false;
    this.isPaymentScreen = false;
  }

  getAllTests() {
    this.iotService.getAllTestByCompanyId(this.selectedIotCompany?.id).subscribe((test: any) => {
      this.allTest = test.data.map((d: any) => {
        return { ...d, isSelected: false };
      });
    });
  }

  onAddPatientCustomer() {
    this.showNextBtnLoader = true;
    const d = new Date();
    let year = d.getFullYear();
    let age = year - new Date(this.patientForm.value['age']).getFullYear();

    let patientData = new FormData();
    patientData.append('name', this.patientForm.value['name']);
    patientData.append('age', age.toString());
    patientData.append('suffering_from_id', this.sufferingFromValue);
    patientData.append('gender', this.patientForm.value['gender']);
    patientData.append('phone', this.mobileNumber);
    patientData.append('email', this.patientForm.value['email']);
    patientData.append('p_address', this.patientForm.value['p_address']);
    patientData.append('weight', this.patientForm.value['weight']);
    patientData.append('height', this.patientForm.value['height']);
    patientData.append('mhu_user_id', this.userId.toString());
    console.log("this.selectedIotCompany ", this.selectedIotCompany);

    if (this.selectedIotCompany.name === "Medtel") {
      let medtelData = new FormData();
      medtelData.append('access_token', 'a3afc0c8a929baf26fc9d3d58da9854c');
      medtelData.append('thp_id', '55923e96e06f6a63a5cd2a6f5b58f7fb');
      medtelData.append('patient_name', this.patientForm.value['name']);
      medtelData.append('mobile', this.mobileNumber);
      medtelData.append('gender', this.patientForm.value['gender'] == '1' ? 'Male' : 'Female');
      medtelData.append('age', age.toString());
      medtelData.append('height', this.patientForm.value['height']);
      medtelData.append('weight', this.patientForm.value['weight']);

      this.medtelRegister(medtelData, (response: any) => {
        console.log("medtel response : ", response);
        patientData.append('iot_company', this.selectedIotCompany.id);
        this.moambulancePatinetCheck(patientData, "Medtel");
      });
    } else if (this.selectedIotCompany.name === "EzeRx") {
      let EzeRexData = new FormData();
      EzeRexData.append('name', this.patientForm.value['name']);
      EzeRexData.append('age', age.toString());
      EzeRexData.append('gender', this.patientForm.value['gender'] == '1' ? 'M' : 'F');
      EzeRexData.append('phone', this.mobileNumber);
      EzeRexData.append('email', this.patientForm.value['email']);
      EzeRexData.append('aadhar', "");
      this.ezerxRegister(EzeRexData, (response: any) => {
        console.log("ezeRx response : ", response);
        patientData.append('iot_company', this.selectedIotCompany.id);
        patientData.append('ezeRxId', response.ezid.toString());
        this.moambulancePatinetCheck(patientData, "ezeRx");
      });
    }
  }

  medtelRegister(medtelData: any, callback: any) {
    this.iotService.patientRegistraion(medtelData).subscribe((result: any) => {
      callback(result);
    },
      (error: any) => {
        this.toastr.error("Error in Medtel Server. Please try again.");
        this.toastr.error(error?.message);
        console.log(error);
      },
    );
  }

  ezerxRegister(EzeRexData: any, callback: any) {
    this.authService.ezerxPatientCreate(EzeRexData, this.ezeRxToken).subscribe((result: any) => {
      callback(result);
    },
      (error: any) => {
        // this.toastr.error("Error in Ezerx Server. Please try again.");
        // this.toastr.error(error?.message);
        console.log(error);
        if (error?.error?.status === 'expired') {
          //login and get new token then call register again.
          this.authService.ezerxLogin().subscribe((response: any) => {
            console.log("----------- ", response);
            if (response?.status === "success") {
              this.ezeRxToken = response["session-token"];
              this.authService.ezerxPatientCreate(EzeRexData, this.ezeRxToken).subscribe((result: any) => {
                callback(result);
              });
            } else {
              this.toastr.error("Error in Ezerx Server. Please try again.");
            }
          });
        }
      },
    );
  }

  moambulancePatinetCheck(patientData: any, type: string) {
    this.getAllTests();
    if (this.patientId != 0) {
      this.iotService.patientUpdate(this.patientId, patientData).subscribe((response: any) => {
        if (response.success) {
          this.showNextBtnLoader = false;
          this.toastr.success(response.message);
          this.patientField = false;
          this.isIotServices = true;
          this.patientForm.reset();
        } else {
          this.toastr.error(response.message);
        }
      },
        (error: any) => {
          console.log(error);
        },
      );
    } else {
      this.ambulanceService.addPatientMedtel(patientData, type).subscribe((response: any) => {
        this.showNextBtnLoader = false;
        if (response.success) {
          this.toastr.success(response.message);
          this.patientField = false;
          this.patientId = response.data.id;
          this.isIotServices = true;
          this.patientDetails = response.data;
          this.patientForm.reset();
        } else {
          this.toastr.error(response.message);
        }
      },
        (error: any) => {
          console.log(error);
        },
      );
    }
  }

  mobileNumberPatch(event: any): any {
    if (!Number(event.target.value)) {
      this.mobileNoExist = true;
      return false;
    }

    if (event.target.value.length === 10) {
      this.getPatientAndUpdateForm(event.target.value);
    } else {
      this.mobileNoExist = true;
    }
  }

  getPatientAndUpdateForm(mobile: any) {
    // console.log("getPatientAndUpdateForm ", mobile);
    this.mobileNoExist = false;
    this.mobileNumber = mobile;
    this.ambulanceService
      .getPatientDetailsByMobile(mobile)
      .subscribe((response: any) => {
        this.patientDetails = response.data;
        // console.log('response', response);
        if (response.success) {
          this.patientId = response.data.id;
          const d = new Date();
          let year = d.getFullYear() - this.patientDetails.age;
          this.patientId = this.patientDetails.id;
          this.patientForm.patchValue({
            name: this.patientDetails.name,
            email: this.patientDetails.email,
            ["phone"]: this.patientDetails.phone,
            age: `${year}-01-01`, //2022 - 07 - 05;
            weight: this.patientDetails.weight,
            height: this.patientDetails.height,
            gender: this.patientDetails.gender,
          });

          this.mobileNoExist = true;
          // this.toastr.warning('Number Already Exist');
        } else {
          console.log("number not found");
          this.patientId = 0;
        }
      });
  }

  getTestFareDetails() {
    this.iotService.getFareDetails(this.testIds).subscribe((data: any) => {
      this.fareData = data.data;
      this.isPaymentScreen = data.success;
      this.isIotServices = !data.success;
      // console.log(data);
    });
  }

  onSelectedTest(test: any) {
    // console.log(this.testIds);
    test.isSelected = !test.isSelected;
    if (test.isSelected) {
      this.testIds.push(test.id);
      // console.log(this.testIds);
    } else {
      let ids = this.testIds.filter((id: any) => {
        return id != test.id;
      });
      // console.log(ids);
      this.testIds = ids;
    }
  }

  onPaymentSubmit(): void {
    this.saveTestOrder();
  }

  async saveTestOrder() {
    // console.log(this.patientDetails);
    let medtelOrder: SaveMedtelOrder = {
      patient_id: this.patientId,
      company_id: 1,
      test_ids: this.testIds,
      status: this.razorpayId ? 1 : 0,
      razor_pay_details: JSON.stringify({ razorpay_id: this.razorpayId }),
    };

    this.iotService.saveFareDetails(medtelOrder).subscribe((response: any) => {
      // console.log('>>>>>', response);
      if (response?.data) {
        this.fareData = null;
        this.toastr.success("Payment Done Successfully");
        this.isPaymentScreen = false;
        this.getPatientsByMvitalUserId();
        this.closeModal.nativeElement.click();
      } else {
        this.toastr.error("Error in payment. Please try again");
      }
    });
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

}
