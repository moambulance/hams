import { MapsAPILoader } from '@agm/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HospitalService } from '../../hospital.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { map, timer } from 'rxjs';
import { PatientService } from 'src/app/modules/admin/patients/patient.service';
import { PatientVitalsComponent } from 'src/app/components/patient-vitals/patient-vitals.component';
import { JanitriVitalsComponent } from 'src/app/components/janitri-vitals/janitri-vitals.component';

@Component({
  selector: 'app-live-ambulance',
  templateUrl: './live-ambulance.component.html',
  styleUrls: ['./live-ambulance.component.css'],
})
export class LiveAmbulanceComponent
  implements OnInit, AfterViewInit, OnDestroy {
  latitude = 28.70406;
  longitude = 77.102493;
  zoom = 8;
  private geoCoder: any;
  sidebarToggle!: boolean;
  sideToggle: boolean = false;
  styles: any = environment.GOOGLE_MAP_STYLE;
  address: string = '';
  mode: string = 'incoming';
  hospital_id: any;
  orders: Array<any> = [];
  incomingSelectedIndex: number = 0;
  activeOrder: any = null;
  mapFullScreen: boolean = false;
  @ViewChild('fullScreen') public fullScreen!: ElementRef;
  base_url: string = environment.BASE_URL;
  hospitalDetails: any = null;
  isCloseClicked: boolean = false;
  incoimgOrderIntreval: any;
  outgoingOrderIntreval: any;
  onBoardedOrderIntreval: any;
  hideBottomwrapper: boolean = false;
  CURRENT_URL: any;
  timeSubscription: any;
  /* patient vitals start */
  @ViewChild('patientVitalsOverlay') public patientVitalsOverlay!: ElementRef;
  @ViewChild(PatientVitalsComponent) patientVitalComponent!: PatientVitalsComponent;
  patientVitals: any;
  /* patient vitals end */

   /* Janitri patient vitals start */
   @ViewChild('janitriVitalsOverlay') public janitriVitalsOverlay!: ElementRef;
   @ViewChild(JanitriVitalsComponent) janitriVitalsComponent!: JanitriVitalsComponent;
   /* Janitri patient vitals end */

  constructor(
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private hospitalService: HospitalService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.CURRENT_URL = this.router.url;
    this.showSpinner();

    const hospital_details: any = this.authService.getRole();
    this.hospital_id = hospital_details.id;
    this.timeSubscription = timer(0, 20000)
      .pipe(
        map(() => {
          this.setCurrentLocation();
          switch (this.mode) {
            case 'outgoing':
              this.getOutGoingOrders();
              break;
            case 'onboarded':
              this.getOnboardedOrders();
              break;

            default:
              this.getIncomingOrders();
              break;
          }
        }),
      )
      .subscribe();
  }

  onTripModeChange(mode: string) {
    if (this.mode === mode) return; //If same mode selectde it will do nothing
    Swal.fire({
      icon: 'info',
      title: 'Are you sure you want to change the trip mode ?',
      text: 'It will reset all your data',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.showSpinner();
        clearInterval(this.incoimgOrderIntreval);
        clearInterval(this.outgoingOrderIntreval);
        clearInterval(this.onBoardedOrderIntreval);
        this.incoimgOrderIntreval = undefined;
        this.outgoingOrderIntreval = undefined;
        this.onBoardedOrderIntreval = undefined;

        this.activeOrder = null;
        this.sideToggle = false;
        this.mode = mode;
        this.orders = [];
        if (this.mode === 'incoming') {
          this.getIncomingOrders();
        } else if (this.mode === 'outgoing') {
          this.getOutGoingOrders();
        } else {
          //onboarding
          this.getOnboardedOrders();
        }
      }
    });
  }

  getIncomingOrders() {
    this.hospitalService
      .getDestinationHospitalOrders(this.hospital_id)
      .subscribe((response: any) => {
        console.log('getIncomingOrders :: ', response);
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

  getOutGoingOrders() {
    this.hospitalService
      .getOrdersByHospital(this.hospital_id, 1)
      .subscribe((response: any) => {
        console.log('hospital order', response);
        if (response && response.length > 0) {
          this.processOrders(response);
        } else {
          this.toastr.warning(
            'Currently No outgoing Ambulances Found',
            'No Ambulance Available',
            { timeOut: 7000 },
          );
          this.hideSpinner();
        }
      });
  }

  getOnboardedOrders() {
    this.hospitalService
      .getDriversByHospital(this.hospital_id)
      .subscribe((response: any) => {
        console.log('onboarded :: ', response);
        if (response.data && response.data.length > 0) {
          this.orders = response.data.map((r: any, i: number) => {
            // console.log(r);
            return {
              latitude: Number(r.lat),
              longitude: Number(r.lon),
              icon: {
                url: 'assets/images/location-ambulance.png',
                scaledSize: {
                  width: 40,
                  height: 40,
                },
              },
              isMarker: false,
              ambulance_type_id: {
                name: r.ambulance_type_name,
                image: r.ambulance_type_image,
              },
              ambulance_id: {
                registration_number: r.registration_number,
              },
              driver_id: {
                name: r.name,
              },
            };
          });
          this.hideSpinner();
          if (this.onBoardedOrderIntreval === undefined) {
            this.onBoardedOrderIntreval = setInterval(() => {
              this.getOnboardedOrders();
            }, 10000);
          }
        } else {
          this.toastr.warning(
            'Currently No Onboarded Ambulances Found',
            'No Ambulance Available',
            { timeOut: 7000 },
          );
          this.hideSpinner();
        }
      });
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

      switch (this.mode) {
        case 'incoming':
          if (this.incoimgOrderIntreval === undefined) {
            this.incoimgOrderIntreval = setInterval(() => {
              this.getIncomingOrders();
            }, 10000);
          }
          break;
        case 'outgoing':
          if (this.outgoingOrderIntreval === undefined) {
            this.outgoingOrderIntreval = setInterval(() => {
              this.getOutGoingOrders();
            }, 10000);
          }
          break;
        default:
          console.log('Invalid mode');
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

  dashboardClick() {
    Swal.fire({
      icon: 'info',
      title: 'Are you sure you want go to dashboard ?',
      text: 'You may lose your data !',
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

  /* Patint vitals report view starts */
  openPatientVitals() {
    this.getPatientDetails(this.activeOrder.patient_id?.id);
  }

  onClosePatientVitalsOverlay(event: any) {
    this.patientVitalsOverlay.nativeElement.style.width = "0%";
  }

  getPatientDetails(id: any) {
    this.patientService.patientDetails(id).subscribe((response: any) => {
      this.patientVitals = response.data;
      if (response.data.medtel_iot.length > 0) {
        this.patientVitalComponent.onParentEventReceived(response.data.medtel_iot);
        this.patientVitalsOverlay.nativeElement.style.width = "100%";
      } else {
        this.toastr.warning("Reports has not been updated for this patient");
        this.patientVitalsOverlay.nativeElement.style.width = "0%";
      }
    });
  }
  /* Patint vitals report view ends*/


  /* Janitri vitals report start */
  openJanitriVitals() {
    // this.janitriVitalsOverlay.nativeElement.style.width = "100%";
    window.open('https://moambulance.janitri.in', '_blank');

  }

  onCloseJanitriVitalsOverlay(event: any) {
    this.janitriVitalsOverlay.nativeElement.style.width = "0%";
  }
  /* Janitri vitals report end */
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

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  ngOnDestroy(): void {
    clearInterval(this.incoimgOrderIntreval);
    clearInterval(this.outgoingOrderIntreval);
    clearInterval(this.onBoardedOrderIntreval);
    this.timeSubscription.unsubscribe();
  }
}
