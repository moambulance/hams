import { MapsAPILoader } from "@agm/core";
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";
import { HospitalService } from "../hospital.service";
import { map, timer } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IotService } from "../../admin/iot/iot.service";
import { Router } from "@angular/router";
import { AmbulanceService } from "../ambulance/ambulance.service";
import { SaveMedtelOrder } from "../../admin/iot/iot.model";
import { PatientService } from "../../admin/patients/patient.service";
import { OrdersService } from "../orders/orders.service";
import Swal from "sweetalert2";

declare var Razorpay: any;

@Component({
    selector: "app-mhu",
    templateUrl: "./mhu.component.html",
    styleUrls: ["./mhu.component.css"],
})
export class MhuComponent implements OnInit, AfterViewInit, OnDestroy {
    latitude = 28.70406;
    longitude = 77.102493;
    zoom = 8;
    private geoCoder: any;
    styles: any = environment.GOOGLE_MAP_STYLE;
    mapFullScreen: boolean = false;
    @ViewChild('fullScreen') public fullScreen!: ElementRef;
    @ViewChild('rideInfoOverlay') public rideInfoOverlay!: ElementRef;
    @ViewChild('patientVitalsOverlay') public patientVitalsOverlay!: ElementRef;
    @ViewChild('closeModal') public closeModal!: ElementRef;
    @ViewChild('audioPlayer') audioPlayer!: ElementRef;
    @ViewChild('patientAddModal') patientAddModal!: ElementRef;
    mode: string = 'incoming';
    hospital_id: any;
    timeSubscription: any;
    orders: Array<any> = [];
    incomingSelectedIndex: number = 0;
    activeOrder: any = null;
    hospitalDetails: any = null;
    isCloseClicked: boolean = false;
    incoimgOrderIntreval: any;
    hideBottomwrapper: boolean = false;
    base_url: string = environment.BASE_URL;
    
    customerPatientAddForm: FormGroup;
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
    activeCompanies: any;
    patientVitals: any;
    medtelIotDetails: any;
    isAudio: boolean = false;
    currentIndex: any;
    currentSrc: any;
    isNewPatient: boolean = false;
    showNextBtnLoader: boolean = false;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private authService: AuthService,
        private hospitalService: HospitalService,
        private formBuilder: FormBuilder,
        private iotService: IotService,
        private router: Router,
        private ambulanceService: AmbulanceService,
        private patientService: PatientService,
        private orderService: OrdersService
    ) {
        this.customerPatientAddForm = this.formBuilder.group({
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
        this.customerPatientAddForm.controls['sufferingFrom'].setValue(0);
    }

    ngOnInit(): void {
        this.showSpinner();
        const hospital_details: any = this.authService.getRole();
        this.hospital_id = hospital_details.id;
        this.timeSubscription = timer(0, 20000)
            .pipe(
                map(() => {
                    this.setCurrentLocation();
                    this.getIncomingOrders();
                }),
            )
            .subscribe();
    }

    processOrders(results: any) {
        this.orders = [];
        if (results.length > 0) {
            this.orders = results.map((r: any, i: number) => {
                return {
                    ...r,
                    latitude: Number(r.driver_id?.lat)
                        ? Number(r.driver_id?.lat)
                        : Number(r.source.split(',')[0]),
                    longitude: Number(r.driver_id?.lon)
                        ? Number(r.driver_id?.lon)
                        : Number(r.source.split(',')[1]),
                    icon: {
                        url: 'assets/images/location-ambulance.png',
                        scaledSize: {
                            width: 40,
                            height: 40,
                        },
                    },
                    isMarker: false,
                    isActive: i == this.incomingSelectedIndex ? true : false,
                };
            });
            // console.log('mode :: ', this.mode);
            switch (this.mode) {
                case 'incoming':
                    if (this.incoimgOrderIntreval === undefined) {
                        this.incoimgOrderIntreval = setInterval(() => {
                            this.getIncomingOrders();
                        }, 10000);
                    }
                    break;

            }
            // console.log('orders ', this.orders);
            this.hideSpinner();
            return this.setActiveOrder();
        }
        return this.bottomwrapperClose();
    }

    ngAfterViewInit(): void {
        this.mapsAPILoader.load().then(() => {
            this.setCurrentLocation();
            this.geoCoder = new google.maps.Geocoder();
            this.getIncomingOrders(); // default mode is incoming
            this.hospitalService
                .getHospitalById(this.hospital_id)
                .subscribe((response: any) => {
                    // console.log(response);
                    this.hospitalDetails = response;
                    this.latitude = Number(this.hospitalDetails.location.split(',')[0]);
                    this.longitude = Number(this.hospitalDetails.location.split(',')[1]);
                });
        });
    }

    getIncomingOrders() {
        this.hospitalService
            .getDestinationHospitalOrders(this.hospital_id)
            .subscribe((response: any) => {
                // console.log('getIncomingOrders :: ', response);
                if (response && response.length > 0) {
                    this.processOrders(response);
                } else if (response.data && response.data.length > 0) {
                    this.processOrders(response);
                } else {
                    this.processOrders([]);
                    this.toastr.warning(
                        'Currently No Incoming Ambulances Found',
                        'No Ambulance Available',
                        { timeOut: 7000 },
                    );
                    this.hideSpinner();
                }
            });
    }

    onMapReady(map: any) {
        map.setOptions({
            zoomControl: 'true',
        });
        let trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
    }

    setActiveOrder() {
        const order = this.orders[this.incomingSelectedIndex];
        const lat = Number(order?.driver_id?.lat)
            ? Number(order?.driver_id?.lat)
            : Number(order?.source.split(',')[0]);
        const lon = Number(order?.driver_id?.lon)
            ? Number(order?.driver_id?.lon)
            : Number(order?.source.split(',')[1]);
        const dLat = Number(order?.destination.split(',')[0]);
        const dLon = Number(order?.destination.split(',')[1]);
        /* strokeColor: '#cc33ff', 
        strokeOpacity :1,
        strokeWeight: 5,
        zIndex: 1,
        geodesic: false,
        clickable: true,
        editable: false, */
        this.activeOrder = {
            ...order,
            origin: new google.maps.LatLng(lat, lon),
            destination1: new google.maps.LatLng(dLat, dLon),
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
        };
        console.log('activeOrder ... ', this.activeOrder);
    }

    onActiveOrderClose(index: number) {
        console.log('onActiveOrderClose');
        this.orders[index].isActive = false;
        this.activeOrder = null;
        this.isCloseClicked = true;
        this.hideBottomwrapper = false;
    }

    bottomwrapperClose() {
        this.hideBottomwrapper = true;
    }

    enableWayPoint(index: number) {
        this.hideBottomwrapper = false;
        if (this.isCloseClicked) {
            this.isCloseClicked = false;
        } else {
            console.log('enableWayPoint');
            this.incomingSelectedIndex = index;
            this.orders.map((order: any, i: number) => {
                if (i == index) {
                    order.isActive = true;
                } else {
                    order.isActive = false;
                }
            });
            this.setActiveOrder();
        }
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
                console.log('position :: ', position);
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
        this.rideInfoOverlay.nativeElement.style.width = "100%";
    }

    onCloseRideInfoOverlay() {
        this.rideInfoOverlay.nativeElement.style.width = "0%";
    }

    onPatientVitalsClick() {
        // this.patientVitalsOverlay.nativeElement.style.width = "100%";
        this.patientId = this.isNewPatient ? this.patientId : this.activeOrder.patient_id?.id;
        console.log("patient id ", this.patientId);
        const patientId = this.patientId;
        if (patientId) {
            this.getPatientDetails(patientId);
        }

    }

    getPatientDetails(id: any) {
        this.patientService.patientDetails(id).subscribe((patientDetails: any) => {
            this.patientVitals = patientDetails.data;
            if (patientDetails.data.medtel_iot.length > 0) {
                this.medtelIotDetails = patientDetails.data.medtel_iot.map(
                    (response: any, index: any) => {
                        return {
                            ...response,
                            isActive: index === 0 ? true : false,
                        };
                    },
                );
                console.log("medtelIotDetails ", this.medtelIotDetails);
                this.patientVitalsOverlay.nativeElement.style.width = "100%";
            } else {
                this.toastr.warning("Reports has not been updated for this patient");
                this.medtelIotDetails = null;
                this.patientVitalsOverlay.nativeElement.style.width = "0%";
            }
        });
    }

    onPlay(i: any) {
        this.currentIndex = i;
        this.audioPlayer.nativeElement.play();
        this.isAudio = true;
        //   console.log(this.audioPlayer.nativeElement.duration());
        // this.audioPlayer.nativeElement.duration();
    }
    onPause(i: any) {
        this.currentIndex = i;
        this.audioPlayer.nativeElement.pause();
        this.isAudio = false;
    }
    onimageClick(src: any) {
        this.currentSrc = src;
    }

    onAccordionClick(medtelDetails: any) {
        medtelDetails.IsActive = !medtelDetails.IsActive;
    }

    onClosePatientVitalsOverlay() {
        this.patientVitalsOverlay.nativeElement.style.width = "0%";
    }

    onAddPatientClick() {
        Swal.fire({
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
            if(!result.isDismissed){
                this.patientAddModal.nativeElement.click();
                this.patientField = true;
                this.isIotServices = false;
                this.isPaymentScreen = false;
                if (result.isConfirmed) {
                    this.isNewPatient = false;
                    this.getPatientAndUpdateForm(this.activeOrder.patient_id.phone);
                } else if (result.isDenied) {
                    this.isNewPatient = true;
                    this.customerPatientAddForm.reset();
                }
            }
        });
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
        let age = year - new Date(this.customerPatientAddForm.value['age']).getFullYear();

        let patientData = new FormData();
        patientData.append('name', this.customerPatientAddForm.value['name']);
        patientData.append('age', age.toString());
        patientData.append('suffering_from_id', this.sufferingFromValue);
        patientData.append('gender', this.customerPatientAddForm.value['gender']);
        patientData.append('phone', this.mobileNumber);
        patientData.append('email', this.customerPatientAddForm.value['email']);
        patientData.append('p_address', this.customerPatientAddForm.value['p_address']);
        patientData.append('weight', this.customerPatientAddForm.value['weight']);
        patientData.append('height', this.customerPatientAddForm.value['height']);

        let medtelData = new FormData();
        medtelData.append('access_token', 'a3afc0c8a929baf26fc9d3d58da9854c');
        medtelData.append('thp_id', '659c061cb58f90e5f0d722c3e43867af');
        medtelData.append('patient_name', this.customerPatientAddForm.value['name']);
        medtelData.append('mobile', this.mobileNumber);
        medtelData.append('gender', this.customerPatientAddForm.value['gender']);
        medtelData.append('age', age.toString());
        medtelData.append('height', this.customerPatientAddForm.value['height']);
        medtelData.append('weight', this.customerPatientAddForm.value['weight']);

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
                this.ambulanceService.addPatient(patientData).subscribe((response: any) => {
                    this.showNextBtnLoader = false;
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
        console.log("getPatientAndUpdateForm ", mobile);
        this.mobileNoExist = false;
        this.mobileNumber = mobile;
        this.ambulanceService
            .getPatientDetailsByMobile(mobile)
            .subscribe((response: any) => {
                this.patientDetails = response.data;
                console.log('response', response);
                if (response.success) {
                    this.patientId = response.data.id;
                    const d = new Date();
                    let year = d.getFullYear() - this.patientDetails.age;
                    this.patientId = this.patientDetails.id;
                    this.customerPatientAddForm.patchValue({
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

    /* updateOrder() {
        console.log("order update ", this.activeOrder?.id, {patient_id: this.patientId});
        this.orderService.updateOrders(this.activeOrder?.id, {patient_id: this.patientId}).subscribe((response) => {
            console.log("order update response ", response);
            this.closeModal.nativeElement.click();
        });
    } */

    onLogout() {
        Swal.fire({
            title: 'Do you want to logout from M-Vitals?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.authService.onHospitalLogout();
                this.router.navigate(['/login']);
            } /* else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info');
            } */
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
        this.timeSubscription.unsubscribe();
        clearInterval(this.incoimgOrderIntreval);
    }
}