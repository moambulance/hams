import { AmbulanceService } from "./../ambulance/ambulance.service";
import { CommonEventsService } from "./../../../common-events.service";
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MapsAPILoader } from "@agm/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "src/app/auth/auth.service";
import { ToastService } from "src/app/services/toast-service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { CustomerService } from "../../admin/customers/customer.service";
import { HospitalService } from "../hospital.service";
import { DriverService } from "../driver/driver.service";
import { KioskService } from "./kiosk.service";
import jsPDF from "jspdf";

@Component({
  selector: "app-kiosk",
  templateUrl: "./kiosk.component.html",
  styleUrls: ["./kiosk.component.css"],
})
export class KioskComponent implements OnInit {
  isPatient: boolean = true;
  ambulanceData: boolean = false;
  farePatchData: boolean = false;
  pageSize: number = 10;
  searchText: any;
  page: number = 1;
  ordersLength: any;
  sufferingFromDetails: any;
  customerForm!: FormGroup;
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,4}$";
  latitude: number = 28.70406;
  longitude: number = 77.102493;
  destinationLatitude: number = 28.70406;
  destinationLongitude: number = 77.102493;
  zoom: number = 12;
  private geoCoder: any;
  sidebarToggle!: boolean;
  isDetination: boolean = false;
  @ViewChild("source") public sourceElementRef!: ElementRef;
  @ViewChild("destination") public destinationElementRef!: ElementRef;
  @ViewChild("closeModal") public closeModal!: ElementRef;
  @ViewChild("fullScreen") public fullScreen!: ElementRef;
  dir: any = undefined;
  customerPatientAddForm: FormGroup;
  bookAmbulanceForm: FormGroup;
  hospital_id: any;
  ambulanceLists: Array<any> = [];
  customerData: any;
  patientDetails: any = null;
  ambulanceType: any = [];
  ambulanceDetails: any;
  fareDeatils: any;
  showCustomerDeatils: boolean = false;
  showFareDeatils: boolean = false;
  makePaymentForm: any;
  showCash: boolean = true;
  showCard: boolean = false;
  showUpi: boolean = false;
  estimatedDistance: string = "0";
  estimatedTime: string = "0:00";
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
  sidebarLoaderText: string = "Loading";
  enablbookButton: boolean = false;
  hospitalDestinationId: number = 0;
  sourceLocation: any = "";
  destinationLocation: any = "";
  mobileNumber: any;
  sufferingFromValue: any;
  patientField: boolean = true;
  orders: any = null;
  afterSelectType: boolean = false;
  classFordisplay = "d-none";
  ambulanceIndex: number = 0;
  ambulanceTypeId: any;
  manageOrderList: any = null;
  user_id: number = 0;
  discount: number = 0
  otherCharges: number = 0
  completeOrders: any;
  completeOrdersLength: any;
  orderDetails: any;
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
    private kioskService: KioskService
  ) {
    this.sidebarToggle = true;
    this.makePaymentForm = this.formBuilder.group({
      payment_method: ["", [Validators.required]],
      cash: [""],
      receipt_no: [""],
      amount: [""],
      discount: [''],
      other_charges: [''],
    });
    this.customerPatientAddForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("[A-Za-z ]+$")]],
      last_name: ["", [Validators.required, Validators.pattern("[A-Za-z ]+$")]],
      age: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
      mobile: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
          ),
          ,
        ],
      ],
      sufferingFrom: ["", [Validators.required]],
      p_address: ["", [Validators.required]],
    });
    this.bookAmbulanceForm = this.formBuilder.group({
      base_fare: ["", [Validators.required]],
      distance_fare: ["", [Validators.required]],
      ppe_kit: ["", [Validators.required]],
      ppe_count: ["1", [Validators.required]],
      ppe_include: ["", [Validators.required]],
      round_off: ["", [Validators.required]],
      total_fare: ["", [Validators.required]],
      taxes: ["", [Validators.required]],
      platform_fare: ["", [Validators.required]],
      driver: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      ambulance_id: ["", [Validators.required]],
      ambulance_type_id: [, [Validators.required]],
      discount_amount: [""],
      payble: ["", [Validators.required]],
      aNumber: ["", [Validators.required]],
      aType: ["", [Validators.required]],
    });
    this.customerPatientAddForm.controls["sufferingFrom"].setValue(0);
    this.bookAmbulanceForm.controls["ambulance_type_id"].setValue(0);
  }

  ngOnInit(): void {
    // this.showSpinner();

    const hospital_details: any = this.authService.getRole();
    this.user_id = hospital_details.user_id;
    this.hospital_id = hospital_details?.id;
    console.log("hospital_details", this.hospital_id);
    this.hospitalService
      ?.getHospitalById(this.hospital_id)
      ?.subscribe((response: any) => {
        this.hospitalDetails = response;
        console.log("hospital details", this.hospitalDetails);
        this.latitude = Number(this.hospitalDetails.location.split(",")[0]);
        this.longitude = Number(this.hospitalDetails.location.split(",")[1]);
      });
    this.sidebarToggle = false;
    this.getSufferingFrom();
    this.getAvailableAmbulance();
  }
  manageOrders() {
    this.kioskService
      .findManagerQueueByHospitalId(this.hospital_id)
      .subscribe((response: any) => {
        console.log("manage Ambulance", response);
        if (response.length > 0) {

          this.manageOrderList = response
            ?.map((result: any, index: any) => {
              console.log("oreder", result);
              return { ...result, sl_no: index + 1 };
            })
            .slice(
              (this.page - 1) * this.pageSize,
              (this.page - 1) * this.pageSize + this.pageSize
            );
        } else {
          this.manageOrderList = null
        }
      });
  }
  endQueueByManager(queue: any) {
    let saveManagerInputs = {
      queue_id: queue.id,
      user_id: this.user_id,
      time_stamp: ''

    }
    this.kioskService
      .updateQueueDisplayOrder(queue.hospital_id, queue.ambulance_id)
      .subscribe((response: any) => {
        console.log("rssss", response);
        if (response.success) {
          this.toastr.success(response.message)
          this.kioskService
            .saveQueueManager(saveManagerInputs)
            .subscribe((response: any) => {
              console.log("rssss", response);
              this.manageOrders();
            })

        } else {
          this.toastr.error(response.message)
        }
        this.manageOrders();
      });
    ;
  }
  getAmbulanceType() {
    this.kioskService.getActiveAmbulanceTypes().subscribe((response: any) => {
      console.log("respsss", response);
      this.ambulanceType = response;
    });
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
      zoomControl: "true",
    });

    let trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }
  sourceLeave(event: any) {
    this.sourceLocation = event.target.value;
  }
  onSourceChange(event: any) {
    if (this.sourceElementRef.nativeElement.value == "") {
      this.latitude = Number(this.hospitalDetails.location.split(",")[0]);
      this.longitude = Number(this.hospitalDetails.location.split(",")[1]);
      this.getAddress(this.latitude, this.longitude, "source");
    }
  }

  ngAfterViewInit(): void {
    this.makePaymentForm.patchValue({
      payment_method: "cash",
    });
    this.mapsAPILoader.load().then((map: any) => {
      this.hideSpinner();
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      let autocomplete = new google.maps.places.Autocomplete(
        this.sourceElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log("place.geometry :: ", place);
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.sourceLocation = this.sourceElementRef.nativeElement.value;
          // this.zoom = 12;
        });
      });

      let destinationAutocomplete = new google.maps.places.Autocomplete(
        this.destinationElementRef.nativeElement
      );
      destinationAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult =
            destinationAutocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log("destination place.geometry :: ", place);
          this.isDetination = true;
          this.sideToggle = true;
          //set latitude, longitude and zoom
          this.destinationLatitude = place.geometry.location.lat();
          this.destinationLongitude = place.geometry.location.lng();
          this.destinationLocation =
            this.destinationElementRef.nativeElement.value;
          const destinationAddr = this.destinationLocation.split(",")[0];
          this.hospitalService
            .getHospitalFromLocation(destinationAddr)
            .subscribe((response: any) => {
              console.log("getHospitalFromLocation :: ", response);
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
              polylineOptions: { strokeColor: "#f00" },
              suppressMarkers: true,
            },
            markerOptions: {
              origin: {
                draggable: false,
                icon: {
                  url: "assets/images/location 1.png",
                  scaledSize: { height: 40, width: 40 },
                },
              },
              destination: {
                draggable: false,
                icon: {
                  url: "assets/images/ic_droppin.png",
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
              console.log("response, status", response, status);
              // console.log("ssss",);

              if (status == "OK") {
                this.estimatedTime = response.routes[0]?.legs[0]?.duration.text;
                let price =
                  response.routes[0]?.legs[0]?.distance.text.split(" ")[0];
                this.estimatedDistance = price.replace(/[^\d.]/g, "");
                console.log("SSS>>>>>>>>>>>>>>>", this.estimatedDistance);
              }
            }
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
    if (this.ppeCountValue == "0") {
      event.target.checked = false;
    }
  }

  dashboardClick() {
    Swal.fire({
      icon: "info",
      title: "Are you sure you want go to dashboard ?",
      text: "You can lose your data !",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        this.router.navigate(["hospital/dashboard"]);
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
    console.log("distance b/w", distanceInKM);
    return distanceInKM.toFixed(2);
  }

  getAvailableAmbulance() {
    this.ambulanceService
      .getAvailableAmbulance(this.hospital_id)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.ambulanceLists = result;

          console.log("this.ambulanceLists", this.ambulanceLists);
        } else {
          this.toastr.warning(
            "Currently all ambulances are booked",
            "No Ambulance Available",
            { timeOut: 7000 }
          );
        }
      });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log('position ', position);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log("setCurrentLocation :: ", this.latitude, this.longitude);
        // this.getAddress(latitude, longitude);
      });
    } else {
      console.log("Location is disabled");
    }
  }

  getAddress(latitude: any, longitude: any, type?: string) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        console.log(results);
        console.log(status);
        if (status === "OK") {
          if (results[0]) {
            if (type === "source") {
              console.log(results);
              this.sourceElementRef.nativeElement.value =
                results[0].formatted_address;
            }
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  showSpinner(name?: string) {
    this.spinner.show(name);
  }

  hideSpinner(name?: string) {
    this.spinner.hide(name);
    if (name === "bookambulanceside") {
      this.sidebarLoaderText = "Loading";
    }
  }

  getSufferingFrom() {
    this.hospitalService.getAllSufferingFrom().subscribe((result: any) => {
      this.sufferingFromDetails = result;
      console.log("sufferingFromDetails", this.sufferingFromDetails);
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
        "Currently all ambulances are booked",
        "No Ambulance Available",
        { timeOut: 7000 }
      );
      return;
    }
    let patientData = new FormData();
    patientData.append("name", this.customerPatientAddForm.value["name"]);
    patientData.append("age", this.customerPatientAddForm.value["age"]);
    patientData.append("suffering_from_id", this.sufferingFromValue);
    patientData.append("gender", this.customerPatientAddForm.value["gender"]);
    patientData.append("phone", this.mobileNumber);
    patientData.append("email", this.customerPatientAddForm.value["email"]);
    patientData.append(
      "p_address",
      this.customerPatientAddForm.value["p_address"]
    );
    this.sidebarLoaderText = "Saving Patient Details";
    // this.showSpinner('bookambulanceside');
    // let customer: any;

    if (!this.patientField) {
      this.isPatient = false;
      this.ambulanceData = true;
      this.hideSpinner("bookambulanceside");
      this.getCustomerPatientDetails();
      this.getAmbulanceType();
    } else {
      this.ambulanceService
        .addPatient(patientData)
        .subscribe((response: any) => {
          if (response.success) {
            this.toastr.success(response.message);
            this.patientField = false;
            this.isPatient = false;
            this.ambulanceData = true;
            this.patientDetails = response.data;
            this.hideSpinner("bookambulanceside");
            this.getAmbulanceType();

            this.getCustomerPatientDetails();
          } else {
            this.toastr.error(response.message);
          }
        });
    }
  }

  getCustomerPatientDetails() {
    this.showCustomerDeatils = true;
    console.log("----", this.customerData);
    this.bookAmbulanceForm.patchValue({
      customer_name: this.patientDetails.name,
      email: this.patientDetails.email,
      mobile: this.patientDetails.phone,
    });
  }

  onAmbulanceTypeSelect(event: any) {
    this.ambulanceTypeId = this.bookAmbulanceForm.value["ambulance_type_id"];
    this.driverDetails = null;
    this.ambulanceDetails = null;
    this.onAmbulanceChange(0)

  }
  onAmbulanceChange(index: any) {


    let ambulanceFareData: any;
    this.kioskService
      .getAmbulanceByTypeAndHospital(this.hospital_id, this.ambulanceTypeId)
      .subscribe((resp: any) => {
        if (resp.length == 0) {
          this.toastr.warning(
            "Currently all ambulances are booked",
            "No Ambulance Available",
            { timeOut: 7000 }
          );
          return;
        }
        console.log("resp", resp);
        this.classFordisplay = "form-group col-md-4";
        this.ambulanceDetails = resp;
        this.sidebarLoaderText = "Fetching Price Details";
        this.showSpinner("bookambulanceside");

        this.ambulanceId = index == 0
          ? this.ambulanceDetails[index].ambulance_id
          : this.ambulanceTypeId = this.bookAmbulanceForm.value["ambulance_type_id"];
        console.log("this.ambulanceId", this.ambulanceId);

        this.driverDetails = this.ambulanceDetails[0].driver;
        ambulanceFareData = {
          app_type: "HAMS",
          hospital_id: this.hospital_id,
          ambulance_type_id: parseInt(
            this.bookAmbulanceForm.value["ambulance_type_id"]
          ),
          distance: parseFloat(this.estimatedDistance),
          ppe_included: this.bookAmbulanceForm.value["ppe_include"],
          ppe_count: this.bookAmbulanceForm.value["ppe_include"]
            ? this.bookAmbulanceForm.value["ppe_count"]
            : 0,
        };
        console.log("***result******", ambulanceFareData);
        if (ambulanceFareData) {
          console.log(">>>>>>>>>>>");
          this.ambulanceService
            .getAmbulanceFareDetails(ambulanceFareData)
            .subscribe((respons: any) => {
              this.showFareDeatils = true;
              console.log("*********", respons);
              this.hideSpinner("bookambulanceside");
              if (respons.success) {
                this.fareDeatils = respons.data;
                console.log(
                  "====++++++",
                  this.fareDeatils.base_fare.toFixed(2)
                );
                console.log(
                  "this.ambulanceDetails[0].ambulance.ambulance_type.name,",
                  this.ambulanceDetails[0].ambulance.ambulance_type.name,
                );
                this.bookAmbulanceForm.patchValue({
                  base_fare: this.fareDeatils.base_fare,
                  aType: this.ambulanceDetails[0].ambulance?.ambulance_type?.name,
                  aNumber: this.ambulanceDetails[0].ambulance.registration_number,
                  distance_fare: Number(this.fareDeatils.distance_fare).toFixed(
                    2
                  ),
                  ppe_kit: this.fareDeatils.ppe_kit_price,
                  round_off: this.fareDeatils.total_fare_roundoff,
                  total_fare: this.fareDeatils.total_fare.toFixed(2),
                  platform_fare:
                    this.fareDeatils.platform_service_fare.toFixed(2),
                  driver:
                    this.driverDetails == undefined
                      ? "NA"
                      : this.driverDetails.name,
                  // amount: this.fareDeatils,
                });
              }
            });
        }
      });

  }
  onPymentMethodChange() {
    if (this.makePaymentForm.value["payment_method"] == "cash") {
      this.showCash = true;
      this.showCard = false;
      this.showUpi = false;
    } else if (this.makePaymentForm.value["payment_method"] == "card") {
      this.showCard = true;
      this.showCash = false;
      this.showUpi = false;
    } else if (this.makePaymentForm.value["payment_method"] == "upi") {
      this.showUpi = true;
      this.showCard = false;
      this.showCash = false;
    }
  }

  addPayment() {
    const payment_details = {
      paymentMode: this.makePaymentForm.value["payment_method"],
      rzp_txn_details: { razorpay_payment_id: "pay_Irg0VDsl9yJbuy" },
      price: this.makePaymentForm.value["cash"],
      status: "success",
    };
    const payment = {
      total_amount: this.fareDeatils.total_fare_roundoff,
      payment_gateway_deatils: JSON.stringify(payment_details),
      customer_id: 0,
      driver_id: this.driverDetails.id,
      patient_id: this.patientDetails.id,
      hospital_id: this.hospital_id,
      ambulance_type_id: this.ambulanceTypeId,
      app_type: "HAMS",
      distance: this.estimatedDistance,
      ppe_included: this.bookAmbulanceForm.value["ppe_include"],
      ppe_count: this.bookAmbulanceForm.value["ppe_include"]
        ? this.bookAmbulanceForm.value["ppe_count"]
        : 0,
    };

    this.ambulanceService
      .saveTransaction(payment)
      .subscribe((response: any) => {
        if (response.success) {
          this.transactionDetails = response.data.data;
          this.transactionId = response.data.data.id;
          this.closeModal.nativeElement.click();

          this.enablbookButton = true;
          this.toastr.success(response.message);
          this.bookAmbulanceForm.patchValue({
            discount_amount: this.makePaymentForm.value["discount"],
            payble:
              this.fareDeatils.total_fare_roundoff -
              this.makePaymentForm.value["discount"],
          });
        }
      });
  }

  submitPayment() {
    console.log("this.sourceLocation", this.sourceLocation);
    console.log("this.destinationLocation", this.destinationLocation);
    console.log("this.transactionId", this.transactionId);
    this.sidebarLoaderText = "Saving Payment Details";
    this.showSpinner("bookambulanceside");
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
      ambulance_type_id: this.ambulanceTypeId,
      ambulance_id: this.ambulanceId,
      transaction_id: this.transactionId,
      destination_hospital_id: this.hospitalDestinationId,
      is_confirm: 0,
      customer_current_lat: this.latitude,
      customer_current_lon: this.longitude,
      order_by: "Kiosks",
    };

    this.ambulanceService.instantOrder(order).subscribe((response: any) => {
      if (response.success) {
        this.toastr.success(response.message, "Book Ambulance Success", {
          timeOut: 5000,
        });
        this.sideToggle = false;
        this.ambulanceData = false;
        this.otpDisplay = true;
        const otp = response.otp;
        console.log("otp ", otp);
        this.otp = [
          otp.substr(0, 1),
          otp.substr(1, 1),
          otp.substr(2, 1),
          otp.substr(3, 1),
        ];
        this.kioskService
          .updateQueueDisplayOrder(this.hospital_id, this.ambulanceId)
          .subscribe((response: any) => {
            console.log("rssss", response);
          });
        this.hideSpinner("bookambulanceside");
        console.log("Instantorder", this.otp);
      } else {
        this.sideToggle = true;
        this.toastr.error(response.message, "Book Ambulance Error", {
          timeOut: 5000,
        });
      }
    });
  }
  getOrders() {
    this.getCompletedOrders()
    this.getOnGoingOrders()
  }
  getOnGoingOrders() {
    console.log(">>id..", this.hospital_id);

    this.kioskService.ongoingOrdersByKiosks(this.hospital_id).subscribe(
      (response: any) => {
        console.log("hospital order", response);
        if (response && response.length > 0) {
          this.ordersLength = response.length;
          this.orders = response
            ?.map((result: any, index: any) => {
              return { ...result, sl_no: index + 1 };
            })
            .slice(
              (this.page - 1) * this.pageSize,
              (this.page - 1) * this.pageSize + this.pageSize
            );
        } else {
          this.toastr.warning(
            "Currently No ongoing rides Found",
            "No ongoing rides Available",
            { timeOut: 7000 }
          );
          this.hideSpinner();
        }
      },
      (error: any) => {
        console.log("error", error);
      }
    );
  }
  getCompletedOrders() {
    this.kioskService
      .completeOrdersByKiosks(this.hospital_id).subscribe(
        (response: any) => {
          console.log("hospital order", response);
          if (response && response.length > 0) {
            this.completeOrdersLength = response.length;
            this.completeOrders = response
              ?.map((result: any, index: any) => {
                return { ...result, sl_no: index + 1 };
              })
              .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
              );
          } else {
            this.toastr.warning(
              "Currently No Complete Rides Found",
              "No Complete Rides Available",
              { timeOut: 7000 }
            );
            this.hideSpinner();
          }
        },
        (error: any) => {
          console.log("error", error);
        }
      );
  }

  mobileNumberPatch(event: any) {
    if (event.target.value.length === 10) {
      this.showCustomerDeatils = true;
      this.mobileNumber = event.target.value;
      this.ambulanceService
        .getPatientDetailsByMobile(event.target.value)
        .subscribe((response: any) => {
          console.log("response", response.data);
          if (response.success) {
            this.patientDetails = response.data;
            this.patientField = false;
            this.showCustomerDeatils = true;
            this.customerPatientAddForm.patchValue({
              name: response.data.name,
              // last_name: response.data.last_name,
              email: response.data.email,
              p_address: response.data.p_address,
              mobile: this.mobileNumber,
              age: response.data.age,
              gender: response.data.gender,
            });
            this.customerPatientAddForm.controls["sufferingFrom"].setValue(
              parseInt(response.data.suffering_from_id)
            );
          }
        });
    } else if (event.target.value.length < 10) {
      this.showCustomerDeatils = false;

      this.customerPatientAddForm.patchValue({
        name: "",
        last_name: "",
        email: "",
      });
    }
  }
  onStatusChange(item: any) {
    console.log("item", item);
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        let is_checked = item.is_active == 1 ? 0 : 1;
        console.log("checked", is_checked);
        if (item.id !== 0) {
          this.kioskService
            .updateQueueStatus(item.hospital_id, item.ambulance_id, is_checked)
            .subscribe((response: any) => {
              console.log("tttt", response);
              Swal.fire("Saved!", "", "success");
              this.manageOrders();
            });
        }
      } else if (result.isDenied) {
        // this.manageOrders();
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
  onPrint(order: any) {
    this.orderDetails = order
  }
  onReset() {
    this.reloadCurrentRoute();
  }
  // reaload page
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
      console.log(currentUrl);
    });
  }

  get age() {
    return this.customerPatientAddForm.get("age");
  }
  get gender() {
    return this.customerPatientAddForm.get("gender");
  }

  get sufferingFrom() {
    return this.customerPatientAddForm.get("sufferingFrom");
  }
  get name() {
    return this.customerPatientAddForm.get("name");
  }
  get last_name() {
    return this.customerPatientAddForm.get("last_name");
  }
  get emails() {
    return this.customerPatientAddForm.get("email");
  }
  get mobile() {
    return this.customerPatientAddForm.get("mobile");
  }
  onPrintOtp() {
    const doc = new jsPDF();

    doc.text(this.otp[0] + this.otp[1] + this.otp[2] + this.otp[3], 10, 10);
    doc.save("otp.pdf");
  }
}
