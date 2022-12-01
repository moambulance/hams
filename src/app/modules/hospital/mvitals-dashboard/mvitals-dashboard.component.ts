import { MapsAPILoader } from "@agm/core";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/auth/auth.service";
import { JanitriVitalsComponent } from "src/app/components/janitri-vitals/janitri-vitals.component";
import { PatientVitalsComponent } from "src/app/components/patient-vitals/patient-vitals.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { SaveMedtelOrder } from "../../admin/iot/iot.model";
import { IotService } from "../../admin/iot/iot.service";
import { PatientService } from "../../admin/patients/patient.service";
import { AmbulanceService } from "../ambulance/ambulance.service";
import { OrdersService } from "../orders/orders.service";

@Component({
  selector: 'app-mvitals-dashboard',
  templateUrl: './mvitals-dashboard.component.html',
  styleUrls: ['./mvitals-dashboard.component.css']
})
export class MvitalsDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fullScreen') public fullScreen!: ElementRef;
  @ViewChild('rideInfoOverlay') public rideInfoOverlay!: ElementRef;
  @ViewChild('patientVitalsOverlay') public patientVitalsOverlay!: ElementRef;
  @ViewChild('closeModal') public closeModal!: ElementRef;
  @ViewChild('patientAddModal') patientAddModal!: ElementRef;
  @ViewChild(PatientVitalsComponent) patientVitalComponent!: PatientVitalsComponent;
  private geoCoder: any;
  latitude = 28.70406;
  longitude = 77.102493;
  zoom = 8;
  mapFullScreen: boolean = false;
  activeOrder: any = null;
  orderIntreval: any;
  base_url: string = environment.BASE_URL;
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
  patientVitals: any = {};
  showNextBtnLoader: boolean = false;
  isOntripOrderExists: boolean = false;
  currentAmbulanceId: number = 0;
  isNewPatient: boolean = false;

    /* Janitri patient vitals start */
    @ViewChild('janitriVitalsOverlay') public janitriVitalsOverlay!: ElementRef;
    @ViewChild(JanitriVitalsComponent) janitriVitalsComponent!: JanitriVitalsComponent;
    /* Janitri patient vitals end */

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private iotService: IotService,
    private ambulanceService: AmbulanceService,
    private patientService: PatientService,
    private orderService: OrdersService
  ) {
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
    this.showSpinner();
    const user: any = this.authService.getRole();
    // console.log("user ", user);
    this.currentAmbulanceId = user.ambulance_id;
  }

  getOntripOrderByAmbulance() {
    this.orderService.findOrdersByAmbulanceId(this.currentAmbulanceId).subscribe((response: any) => {
      // console.log("getOntripOrderByAmbulance :: ", response);
      if (!response.success) {
        this.isOntripOrderExists = false;
        this.toastr.warning("You don't have any ontrip ambulance to show.");
      } else {
        this.isOntripOrderExists = true;
        this.processOrder(response.data);
      }
      this.hideSpinner();
    });
  }

  processOrder(result: any) {
    if (result) {
      const lat = Number(result.driver_id?.lat) ? Number(result.driver_id?.lat) : Number(result.source.split(',')[0])
      const lon = Number(result.driver_id?.lon) ? Number(result.driver_id?.lon) : Number(result.source.split(',')[1]);
      const dLat = Number(result?.destination.split(',')[0]);
      const dLon = Number(result?.destination.split(',')[1]);
      this.activeOrder = {
        ...result,
        latitude: lat,
        longitude: lon,
        origin: new google.maps.LatLng(lat, lon),
        destination1: new google.maps.LatLng(dLat, dLon),
        icon: {
          url: 'assets/images/location-ambulance.png',
          scaledSize: {
            width: 40,
            height: 40,
          },
        },
        render_options: {
          polylineOptions: { strokeColor: '#f00' },
          suppressMarkers: true,
        },
        marker_options: {
          origin: {
            draggable: false,
            icon: {
              url: 'assets/images/location 1.png',
              scaledSize: { height: 40, width: 40 },
            },
          },
          destination: {
            draggable: false,
            icon: {
              url: 'assets/images/ic_droppin.png',
              scaledSize: { height: 40, width: 40 },
            },
          },
        },
        isMarker: false
      };

      if (this.orderIntreval === undefined) {
        this.orderIntreval = setInterval(() => {
          this.getOntripOrderByAmbulance();
        }, 10000);
      }

      this.hideSpinner();
    }
  }

  ngAfterViewInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      this.getOntripOrderByAmbulance();
    });
  }

  onMapReady(map: any) {
    map.setOptions({
      zoomControl: 'true',
    });
    let trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }

  getLocation(source: string) {
    const location = source.split(',');
    const address: any = this.getAddress(
      Number(location[0]),
      Number(location[1]),
    );
    return address.status ? address.data : 'In Valid Location';
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log('position :: ', position);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // this.zoom = 15;
        //this.getAddress(this.latitude, this.longitude);
      });
    } else {
      console.log('no navigator found');
      /* this.latitude = Number(hospital_details.location.split(",")[0]);
      this.longitude = Number(hospital_details.location.split(",")[1]); */
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        console.log(results);
        console.log(status);
        if (status === 'OK') {
          if (results[0]) {
            return {
              message: 'Data Found',
              data: results[0].formatted_address,
              status: true,
            };
          } else {
            return {
              message: 'No results found',
              data: null,
              status: false,
            };
          }
        } else {
          return {
            message: 'Geocoder failed due to: ' + status,
            data: null,
            status: false,
          };
        }
      },
    );
  }

  onRideInfoClick() {
    if (!this.isOntripOrderExists) {
      this.toastr.error("This Ambulance is not on trip. You can't view any ride info.")
    } else {
      this.rideInfoOverlay.nativeElement.style.width = "100%";
    }
  }

  onCloseRideInfoOverlay() {
    this.rideInfoOverlay.nativeElement.style.width = "0%";
  }

  onPatientVitalsClick() {
    if (!this.isOntripOrderExists) {
      this.toastr.error("This Ambulance is not on trip. You can't view any patient vitals.")
    } else {
      // this.patientId = this.isNewPatient ? this.patientId : this.activeOrder.patient_id?.id;
      this.patientId = this.activeOrder.patient_id?.id;
      // console.log("patient id ", this.patientId);
      const patientId = this.patientId;
      if (patientId) {
        this.getPatientDetails(patientId);
      }
    }
  }

  getPatientDetails(id: any) {
    this.patientService.patientDetails(id).subscribe((response: any) => {
      if (response.data.medtel_iot.length > 0) {
        this.patientVitalComponent.onParentEventReceived(response.data.medtel_iot);
        this.patientVitalsOverlay.nativeElement.style.width = "100%";
      } else {
        this.toastr.warning("Reports has not been updated for this patient");
        this.patientVitalsOverlay.nativeElement.style.width = "0%";
      }
    });
  }

  onClosePatientVitalsOverlay(event: any) {
    this.patientVitalsOverlay.nativeElement.style.width = "0%";
  }

  /* Janitri vitals report start */
  onJanitriVitalsClick() {
    // this.janitriVitalsOverlay.nativeElement.style.width = "100%";
    window.open('https://moambulance.janitri.in', '_blank');

  }

  onCloseJanitriVitalsOverlay(event: any) {
    this.janitriVitalsOverlay.nativeElement.style.width = "0%";
  }
  /* Janitri vitals report end */

  onAddPatientClick() {
    if (!this.isOntripOrderExists) {
      this.toastr.error("This Ambulance is not on trip. You can't book any patient.")
    } else {
      this.patientAddModal.nativeElement.click();
      this.patientField = true;
      this.isIotServices = false;
      this.isPaymentScreen = false;
      this.getPatientAndUpdateForm(this.activeOrder.patient_id.phone);
    }
    /* Swal.fire({
      title: 'Please select one from below.',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Current on trip patient`,
      confirmButtonColor: '#0076bc',
      denyButtonText: `New Patient`,
      denyButtonColor: '#ef1e68',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false
    }).then((result) => {
      if (!result.isDismissed) {
        this.patientAddModal.nativeElement.click();
        this.patientField = true;
        this.isIotServices = false;
        this.isPaymentScreen = false;
        if (result.isConfirmed) {
          this.isNewPatient = false;
          this.getPatientAndUpdateForm(this.activeOrder.patient_id.phone);
        } else if (result.isDenied) {
          this.isNewPatient = true;
          this.patientForm.reset();
        }
      }
    }); */
  }

  getAllTests() {
    let medtelId: number = 1;
    this.iotService.getAllTestByCompanyId(medtelId).subscribe((test: any) => {
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

    let medtelData = new FormData();
    medtelData.append('access_token', 'a3afc0c8a929baf26fc9d3d58da9854c');
    medtelData.append('thp_id', '55923e96e06f6a63a5cd2a6f5b58f7fb');
    medtelData.append('patient_name', this.patientForm.value['name']);
    medtelData.append('mobile', this.mobileNumber);
    medtelData.append('gender', this.patientForm.value['gender'] == '1' ? 'Male' : 'Female');
    medtelData.append('age', age.toString());
    medtelData.append('height', this.patientForm.value['height']);
    medtelData.append('weight', this.patientForm.value['weight']);

    // To do - optimize this code
    this.iotService.patientRegistraion(medtelData).subscribe((result: any) => {
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
        this.ambulanceService.addPatient(patientData).subscribe((response: any) => {
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
    },
      (error: any) => {
        console.log(error);
      },
    );
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

  getTestFareDetails() {
    this.iotService.getFareDetails(this.testIds).subscribe((data: any) => {
      this.fareData = data.data;
      this.isPaymentScreen = data.success;
      this.isIotServices = !data.success;
      // console.log(data);
    });
  }

  onPaymentSubmit(): void {
    this.saveTestOrder();
    /* this.options = {
        key: this.rzp_api_key, // Your api key
        currency: 'INR',
        name: 'Mo Ambulance',
        description: 'Mo Ambulance Fare',
        amount: 100 * +this.fareData?.fareDetails?.total_price,
        prefill: {
            email: this.patientDetails.email,
            name: this.patientDetails.name,
            contact: this.patientDetails.phone,
        },
        handler: (response) => {
            this.razorpayId = response.razorpay_payment_id;
            return this.saveTestOrder();
        },
    };
  
    let rzp1 = new Razorpay(this.options);
    rzp1.open(); */
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
        // this.updateOrder();
        this.closeModal.nativeElement.click();
      } else {
        this.toastr.error("Error in payment. Please try again");
      }
    });
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

  onMapFullScreenClick() {
    const elem = this.fullScreen.nativeElement;
    if (!this.mapFullScreen) {
      this.mapFullScreen = true;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } else {
      // exit full screen
      this.mapFullScreen = false;
      // console.log('exit full screen');
      if (elem.exitFullscreen) {
        elem.exitFullscreen();
      } else if (elem.msExitFullscreen) {
        elem.msExitFullscreen();
      } else if (elem.mozCancelFullScreen) {
        elem.mozCancelFullScreen();
      } else if (elem.webkitExitFullscreen) {
        elem.webkitExitFullscreen();
      }
    }
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  ngOnDestroy(): void {
    clearInterval(this.orderIntreval);
  }

}