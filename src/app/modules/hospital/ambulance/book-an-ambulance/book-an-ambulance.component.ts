import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AmbulanceService } from '../ambulance.service';
import { HospitalService } from '../../hospital.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonEventsService } from 'src/app/common-events.service';
import { MapsAPILoader } from '@agm/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ToastService } from 'src/app/services/toast-service';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/modules/admin/customers/customer.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-book-an-ambulance',
  templateUrl: './book-an-ambulance.component.html',
  styleUrls: ['./book-an-ambulance.component.css'],
})
export class BookAnAmbulanceComponent implements OnInit, AfterViewInit {
  sufferingFromDetails: any;
  customerForm!: FormGroup;
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,4}$';
  latitude: number = 28.70406;
  longitude: number = 77.102493;
  destinationLatitude: number = 28.70406;
  destinationLongitude: number = 77.102493;
  zoom: number = 12;
  private geoCoder: any;
  sidebarToggle!: boolean;
  isDetination: boolean = false;
  @ViewChild('source') public sourceElementRef!: ElementRef;
  @ViewChild('destination') public destinationElementRef!: ElementRef;
  @ViewChild('closeModal') public closeModal!: ElementRef;
  @ViewChild('fullScreen') public fullScreen!: ElementRef;
  dir: any = undefined;
  customerPatientAddForm: FormGroup;
  bookAmbulanceForm: FormGroup;
  hospital_id: any;
  ambulanceLists: Array<any> = [];
  customerData: any;
  patientDetails: any;
  ambulanceType: any;
  ambulanceDetails: any;
  fareDeatils: any;
  showCustomerDeatils: boolean = false;
  showFareDeatils: boolean = false;
  makePaymentForm: any;
  showCash: boolean = true;
  showCard: boolean = false;
  showUpi: boolean = false;
  estimatedDistance: string = '0';
  estimatedTime: string = '0:00';
  sideToggle: boolean = false;
  enableCount: boolean = false;
  ppeCountValue: any;
  styles: any = environment.GOOGLE_MAP_STYLE;
  driverDetails: any;
  hospitalDetails: any;
  transactionDetails: any;
  transactionId: any;
  ambulanceId: any;
  otpDisplay: boolean = false;
  otp: any;
  mapFullScreen: boolean = false;
  patientFormSubmitted: boolean = false;
  sidebarLoaderText: string = 'Loading';
  enablbookButton: boolean = false;
  hospitalDestinationId: number = 0;
  sourceLocation: any = '';
  destinationLocation: any = '';
  mobileNumber: any;
  sufferingFromValue: any;
  patientField: boolean = true;
  discount: number = 0
  otherCharges: number = 0

  constructor(
    private hospitalService: HospitalService,
    private customerService: CustomerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private ambulanceService: AmbulanceService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private commonEventService: CommonEventsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public toastService: ToastService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {
    this.sidebarToggle = true;
    this.makePaymentForm = this.formBuilder.group({
      payment_method: ['', [Validators.required]],
      cash: [''],
      receipt_no: [''],
      amount: [''],
      discount: [''],
      other_charges: [''],
    });
    this.customerPatientAddForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+$')]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      mobile: [
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
      c_address: ['', [Validators.required]],
    });
    this.bookAmbulanceForm = this.formBuilder.group({
      base_fare: ['', [Validators.required]],
      distance_fare: ['', [Validators.required]],
      ppe_kit: ['', [Validators.required]],
      ppe_count: ['1', [Validators.required]],
      ppe_include: ['', [Validators.required]],
      round_off: ['', [Validators.required]],
      total_fare: ['', [Validators.required]],
      taxes: ['', [Validators.required]],
      platform_fare: ['', [Validators.required]],
      driver: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      ambulance_id: ['', [Validators.required]],
      discount_amount: [''],
      payble: ['', [Validators.required]],
    });
    this.customerPatientAddForm.controls['sufferingFrom'].setValue(0);
    this.bookAmbulanceForm.controls['ambulance_id'].setValue(0);
  }

  ngOnInit(): void {
    // this.showSpinner();
    const hospital_details: any = this.authService.getRole();

    console.log('hospital_details', hospital_details);
    this.hospital_id = hospital_details.id;
    this.hospitalService
      ?.getHospitalById(this.hospital_id)
      ?.subscribe((response: any) => {
        this.hospitalDetails = response;
        console.log('hospital details', this.hospitalDetails);
        this.latitude = Number(this.hospitalDetails.location.split(',')[0]);
        this.longitude = Number(this.hospitalDetails.location.split(',')[1]);
      });
    this.sidebarToggle = false;
    this.getSufferingFrom();
    this.getAvailableAmbulance();
  }
  onDiscountChange(event: any) {
    console.log('event', event.target.value);
    this.discount = parseFloat(event.target.value) ? parseFloat(event.target.value) : 0

    if (this.discount <= this.fareDeatils.total_fare_roundoff) {
      this.makePaymentForm.patchValue({
        amount: this.fareDeatils.total_fare_roundoff,
        discount: this.discount,
        other_charges: this.otherCharges,
        cash: parseFloat(this.fareDeatils.total_fare_roundoff) + this.otherCharges - this.discount,
      });
    } else {
      this.discount = parseFloat(this.fareDeatils.total_fare_roundoff);
      this.makePaymentForm.patchValue({
        amount: this.fareDeatils.total_fare_roundoff,
        discount: this.discount,
        other_charges: this.otherCharges,
        cash: parseFloat(this.fareDeatils.total_fare_roundoff) + this.otherCharges - this.discount,
      });
    }
  }
  onOtherChargesChange(event: any) {
    this.otherCharges = parseFloat(event.target.value) ? parseFloat(event.target.value) : 0
    this.makePaymentForm.patchValue({
      amount: this.fareDeatils.total_fare_roundoff,
      discount: this.discount,
      other_charges: this.otherCharges,
      cash: parseFloat(this.fareDeatils.total_fare_roundoff) + this.otherCharges - this.discount,
    });
  }
  onPay() {
    this.makePaymentForm.patchValue({
      amount: this.fareDeatils.total_fare_roundoff,
      // discount: this.makePaymentForm.value['discount'],
      cash: this.fareDeatils.total_fare_roundoff,
    });
  }

  onMapReady(map: any) {
    map.setOptions({
      zoomControl: 'true',
    });

    let trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }
  sourceLeave(event: any) {
    this.sourceLocation = event.target.value;
    console.log('event>>>>>>>>>>>>>>', event.target.value);
  }
  onSourceChange(event: any) {
    if (this.sourceElementRef.nativeElement.value == '') {
      this.latitude = Number(this.hospitalDetails.location.split(',')[0]);
      this.longitude = Number(this.hospitalDetails.location.split(',')[1]);
      this.getAddress(this.latitude, this.longitude, 'source');
    }
  }

  ngAfterViewInit(): void {
    this.makePaymentForm.patchValue({
      payment_method: 'cash',
    });
    this.mapsAPILoader.load().then((map: any) => {
      this.hideSpinner();
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      let autocomplete = new google.maps.places.Autocomplete(
        this.sourceElementRef.nativeElement,
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log('place.geometry :: ', place);
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.sourceLocation = this.sourceElementRef.nativeElement.value;
          // this.zoom = 12;
        });
      });

      let destinationAutocomplete = new google.maps.places.Autocomplete(
        this.destinationElementRef.nativeElement,
      );
      destinationAutocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult =
            destinationAutocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log('destination place.geometry :: ', place);
          this.isDetination = true;
          this.sideToggle = true;
          //set latitude, longitude and zoom
          this.destinationLatitude = place.geometry.location.lat();
          this.destinationLongitude = place.geometry.location.lng();
          this.destinationLocation =
            this.destinationElementRef.nativeElement.value;
          const destinationAddr = this.destinationLocation.split(',')[0];
          console.log(`destinationAddr`, destinationAddr)
          this.hospitalService
            .getHospitalFromLocation(destinationAddr)
            .subscribe((response: any) => {
              console.log('getHospitalFromLocation :: ', response);
              if (response) {
                this.hospitalDestinationId = response?.id;
              }
            });
          this.dir = {
            origin: { lat: this.latitude, lng: this.longitude },
            destination: {
              lat: this.destinationLatitude,
              lng: this.destinationLongitude,
            },
            renderOptions: {
              polylineOptions: { strokeColor: '#f00' },
              suppressMarkers: true,
            },
            markerOptions: {
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
          };

          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: { lat: this.latitude, lng: this.longitude },
              destination: {
                lat: this.destinationLatitude,
                lng: this.destinationLongitude,
              },
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              console.log('response, status', response, status);
              // console.log("ssss",);

              if (status == 'OK') {
                this.estimatedTime = response.routes[0]?.legs[0]?.duration.text;
                let price =
                  response.routes[0]?.legs[0]?.distance.text.split(' ')[0];
                this.estimatedDistance = price.replace(/[^\d.]/g, '');
                console.log('SSS>>>>>>>>>>>>>>>', this.estimatedDistance);
              }
            },
          );
          // });
        });
      });
    });
  }

  onPPEkitInclude(event: any) {
    if (event.target.checked) {
      this.enableCount = true;
    } else {
      this.enableCount = false;
    }
    if (this.ppeCountValue == '0') {
      event.target.checked = false;
    }
  }

  dashboardClick() {
    Swal.fire({
      icon: 'info',
      title: 'Are you sure you want go to dashboard ?',
      text: 'You can lose your data !',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        this.router.navigate(['hospital/dashboard']);
      }
    });
  }

  convertToRadians(degrees: any) {
    return (degrees / 180) * Math.PI;
  }

  getDistBetweenTwoLocation({ lat1, lon1, lat2, lon2 }: any) {
    //distance calculation
    var R = 6371e3; // metres
    var φ1 = this.convertToRadians(lat1);
    var φ2 = this.convertToRadians(lat2);
    var Δφ = this.convertToRadians(lat2 - lat1);
    var Δλ = this.convertToRadians(lon2 - lon1);

    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    var distanceInKM = d / 1000;
    console.log('distance b/w', distanceInKM);
    return distanceInKM.toFixed(2);
  }

  getAvailableAmbulance() {
    this.ambulanceService
      .getAvailableAmbulance(this.hospital_id)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.ambulanceLists = result;

          console.log('this.ambulanceLists', this.ambulanceLists);
        } else {
          this.toastr.warning(
            'Currently all ambulances are booked',
            'No Ambulance Available',
            { timeOut: 7000 },
          );
        }
      });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log('position ', position);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('setCurrentLocation :: ', this.latitude, this.longitude);
        // this.getAddress(latitude, longitude);
      });
    } else {
      console.log('Location is disabled');
    }
  }

  getAddress(latitude: any, longitude: any, type?: string) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        console.log(results);
        console.log(status);
        if (status === 'OK') {
          if (results[0]) {
            if (type === 'source') {
              console.log(results);
              this.sourceElementRef.nativeElement.value =
                results[0].formatted_address;
            }
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      },
    );
  }

  showSpinner(name?: string) {
    this.spinner.show(name);
  }

  hideSpinner(name?: string) {
    this.spinner.hide(name);
    if (name === 'bookambulanceside') {
      this.sidebarLoaderText = 'Loading';
    }
  }

  getSufferingFrom() {
    this.hospitalService.getAllSufferingFrom().subscribe((result: any) => {
      this.sufferingFromDetails = result;
      console.log('sufferingFromDetails', this.sufferingFromDetails);
    });
  }

  //  Sidebar Toggle Click //
  onToggleClick() {
    if (this.sidebarToggle) {
      this.sidebarToggle = !this.sidebarToggle;
      this.commonEventService.onSidebarToggle(this.sidebarToggle);
    } else {
      this.sidebarToggle = !this.sidebarToggle;
      this.commonEventService.onSidebarToggle(this.sidebarToggle);
    }
  }

  onSufferingFromChange(event: any) {
    this.sufferingFromValue = event.target.value;
    console.log(event.target.value);
  }

  onAddPatientCustomer() {
    if (this.ambulanceLists.length == 0) {
      this.toastr.warning(
        'Currently all ambulances are booked',
        'No Ambulance Available',
        { timeOut: 7000 },
      );
      return;
    }
    let patientData = new FormData();
    patientData.append('name', this.customerPatientAddForm.value['name']);
    patientData.append('age', this.customerPatientAddForm.value['age']);
    patientData.append('suffering_from_id', this.sufferingFromValue);
    patientData.append('gender', this.customerPatientAddForm.value['gender']);
    patientData.append('phone', this.mobileNumber);
    patientData.append('email', this.customerPatientAddForm.value['email']);
    patientData.append(
      'p_address',
      this.customerPatientAddForm.value['c_address'],
    );
    this.sidebarLoaderText = 'Saving Patient Details';
    // this.showSpinner('bookambulanceside');
    // let customer: any;

    if (!this.patientField) {
      this.hideSpinner('bookambulanceside');
      this.getCustomerPatientDetails();
    } else {
      this.ambulanceService
        .addPatient(patientData)
        .subscribe((response: any) => {
          if (response.success) {
            this.toastr.success(response.message);
            this.patientField = false;
            this.patientDetails = response.data;
            this.hideSpinner('bookambulanceside');
            this.getCustomerPatientDetails();
          } else {
            this.toastr.error(response.message);
          }
        });
    }
  }

  getCustomerPatientDetails() {
    this.showCustomerDeatils = true;
    console.log('----', this.customerData);
    this.bookAmbulanceForm.patchValue({
      customer_name: this.patientDetails.name,
      email: this.customerData.email,
      mobile: this.customerData.phone,
    });
  }

  onAmbulanceSelect() {
    this.sidebarLoaderText = 'Fetching Price Details';
    this.showSpinner('bookambulanceside');
    this.driverDetails = null;
    this.ambulanceId = this.bookAmbulanceForm.value['ambulance_id'];
    console.log('ambulanceId', this.ambulanceId);

    this.ambulanceService
      .getDriverByAmbulanceId(this.ambulanceId)
      .subscribe((result: any) => {
        console.log('getDriverByAmbulanceId :: ', result);
        this.driverDetails = result?.data === null ? {} : result;
        console.log('***result******', this.driverDetails);
      });
    this.ambulanceDetails = this.ambulanceLists.filter((a: any) => {
      if (this.ambulanceId == a.id) {
        return {
          ...a,
        };
      }
    })[0];
    // .replace(/\D/g, '')
    this.ambulanceType = this.ambulanceDetails.ambulance_type_id;
    // console.log('this.estimatedDistance');
    const ambulanceFareData = {
      app_type: 'HAMS',
      hospital_id: this.hospital_id,
      ambulance_type_id: this.ambulanceType,
      distance: parseFloat(this.estimatedDistance),
      ppe_included: this.bookAmbulanceForm.value['ppe_include'],
      ppe_count: this.bookAmbulanceForm.value['ppe_include']
        ? this.bookAmbulanceForm.value['ppe_count']
        : 0,
    };
    this.ambulanceService
      .getAmbulanceFareDetails(ambulanceFareData)
      .subscribe((response: any) => {
        console.log('*********', response);
        this.hideSpinner('bookambulanceside');
        if (response.success) {
          this.fareDeatils = response.data;
          console.log('====++++++', this.fareDeatils.base_fare.toFixed(2));
          this.showFareDeatils = true;
          this.bookAmbulanceForm.patchValue({
            base_fare: this.fareDeatils.base_fare,
            distance_fare: Number(this.fareDeatils.distance_fare).toFixed(2),
            ppe_kit: this.fareDeatils.ppe_kit_price,
            round_off: this.fareDeatils.total_fare_roundoff,
            total_fare: this.fareDeatils.total_fare.toFixed(2),
            platform_fare: this.fareDeatils.platform_service_fare.toFixed(2),
            driver:
              this.driverDetails == undefined ? 'NA' : this.driverDetails.name,
            // amount: this.fareDeatils,
          });
        }
      });
  }

  onPymentMethodChange() {
    if (this.makePaymentForm.value['payment_method'] == 'cash') {
      this.showCash = true;
      this.showCard = false;
      this.showUpi = false;
    } else if (this.makePaymentForm.value['payment_method'] == 'card') {
      this.showCard = true;
      this.showCash = false;
      this.showUpi = false;
    } else if (this.makePaymentForm.value['payment_method'] == 'upi') {
      this.showUpi = true;
      this.showCard = false;
      this.showCash = false;
    }
  }

  addPayment() {
    const payment_details = {
      paymentMode: this.makePaymentForm.value['payment_method'],
      rzp_txn_details: { razorpay_payment_id: 'pay_Irg0VDsl9yJbuy' },
      price: this.makePaymentForm.value['cash'],
      status: 'success',
    };
    const payment = {
      total_amount: this.fareDeatils.total_fare_roundoff,
      payment_gateway_deatils: JSON.stringify(payment_details),
      customer_id: 0,
      driver_id: this.driverDetails.id,
      patient_id: this.patientDetails.id,
      hospital_id: this.hospital_id,
      ambulance_type_id: this.ambulanceType,
      app_type: 'HAMS',
      distance: this.estimatedDistance,
      ppe_included: this.bookAmbulanceForm.value['ppe_include'],
      ppe_count: this.bookAmbulanceForm.value['ppe_include']
        ? this.bookAmbulanceForm.value['ppe_count']
        : 0,
    };

    this.ambulanceService
      .saveTransaction(payment)
      .subscribe((response: any) => {
        if (response.success) {
          this.enablbookButton = true;
          this.transactionDetails = response.data.data;
          this.transactionId = response.data.data.id;
          this.closeModal.nativeElement.click();

          this.toastr.success(response.message);
          this.bookAmbulanceForm.patchValue({
            discount_amount: this.makePaymentForm.value['discount'],
            payble:
              this.fareDeatils.total_fare_roundoff -
              this.makePaymentForm.value['discount'],
          });
        }
      });
  }

  submitPayment() {
    console.log('this.sourceLocation', this.sourceLocation);
    console.log('this.destinationLocation', this.destinationLocation);
    console.log('this.transactionId', this.transactionId);
    this.sidebarLoaderText = 'Saving Payment Details';
    this.showSpinner('bookambulanceside');
    const order = {
      source: `${this.latitude} ,${this.longitude}`,
      destination: `${this.destinationLatitude} ,${this.destinationLongitude}`,
      source_location: this.sourceLocation,
      destination_location: this.destinationLocation,
      status: 0,
      distance: this.estimatedDistance,
      price: this.fareDeatils.total_fare_roundoff,
      discount: this.discount,
      other_charges: this.otherCharges,
      estimated_time: this.estimatedTime,
      customer_id: 0,
      driver_id: this.driverDetails.id,
      patient_id: this.patientDetails.id,
      hospital_id: this.hospital_id,
      ambulance_type_id: this.ambulanceType,
      ambulance_id: this.ambulanceId,
      transaction_id: this.transactionId,
      destination_hospital_id: this.hospitalDestinationId,
      is_confirm: 0,
      customer_current_lat: this.latitude,
      customer_current_lon: this.longitude,
      order_by: 'Hospital',
    };

    this.ambulanceService.instantOrder(order).subscribe((response: any) => {
      if (response.success) {
        this.toastr.success(response.message, 'Book Ambulance Success', {
          timeOut: 5000,
        });
        this.sideToggle = false;
        this.otpDisplay = true;
        const otp = response.otp;
        console.log('otp ', otp);
        this.otp = [
          otp.substr(0, 1),
          otp.substr(1, 1),
          otp.substr(2, 1),
          otp.substr(3, 1),
        ];

        this.hideSpinner('bookambulanceside');
        console.log('Instantorder', this.otp);
      } else {
        this.sideToggle = true;
        this.toastr.error(response.message, 'Book Ambulance Error', {
          timeOut: 5000,
        });
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
      console.log('exit full screen');
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
  mobileNumberPatch(event: any) {
    if (event.target.value.length === 10) {
      this.mobileNumber = event.target.value;
      this.ambulanceService
        .getPatientDetailsByMobile(event.target.value)
        .subscribe((response: any) => {
          console.log('response', response.data);
          if (response.success) {
            this.patientDetails = response.data;
            this.patientField = false;
            this.customerPatientAddForm.patchValue({
              name: response.data.name,
              // last_name: response.data.last_name,
              email: response.data.email,
              c_address: response.data.p_address,
              mobile: this.mobileNumber,
              age: response.data.age,
              gender: response.data.gender,
            });
            this.customerPatientAddForm.controls['sufferingFrom'].setValue(
              parseInt(response.data.suffering_from_id),
            );
          }
        });
    } else if (event.target.value.length < 10) {
      this.customerPatientAddForm.patchValue({
        name: '',
        last_name: '',
        email: '',
      });
    }
  }
  onReset() {
    this.reloadCurrentRoute();
  }
  // reaload page
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
      console.log(currentUrl);
    });
  }

  get age() {
    return this.customerPatientAddForm.get('age');
  }
  get gender() {
    return this.customerPatientAddForm.get('gender');
  }

  get sufferingFrom() {
    return this.customerPatientAddForm.get('sufferingFrom');
  }
  get name() {
    return this.customerPatientAddForm.get('name');
  }
  get last_name() {
    return this.customerPatientAddForm.get('last_name');
  }
  get emails() {
    return this.customerPatientAddForm.get('email');
  }
  get mobile() {
    return this.customerPatientAddForm.get('mobile');
  }
}
