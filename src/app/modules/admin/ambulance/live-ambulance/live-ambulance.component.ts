import { map, timer } from 'rxjs';
import { MapsAPILoader } from '@agm/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AdminService } from '../../admin.service';
import { PatientService } from '../../patients/patient.service';
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
  address: string = '';
  orders: Array<any> = [];
  incomingSelectedIndex: number = 0;
  activeOrder: any = null;
  mapFullScreen: boolean = false;
  @ViewChild('fullScreen') public fullScreen!: ElementRef;

  base_url: string = environment.BASE_URL;
  isCloseClicked: boolean = false;
  breadCrumbData: any = {
    heading: '',
  };
  hideBottomwrapper: boolean = false;
  timeSubscription: any;
  /* patient vitals start */
  @ViewChild('patientVitalsOverlay') public patientVitalsOverlay!: ElementRef;
  @ViewChild(PatientVitalsComponent) patientVitalComponent!: PatientVitalsComponent;
  patientVitals: any;
  medtelIotDetails: any;
  /* patient vitals end */
  
  /* Janitri patient vitals start */
  @ViewChild('janitriVitalsOverlay') public janitriVitalsOverlay!: ElementRef;
  @ViewChild(JanitriVitalsComponent) janitriVitalsComponent!: JanitriVitalsComponent;
  /* Janitri patient vitals end */

  constructor(
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private toastr: ToastrService,
    private adminService: AdminService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.showSpinner();
    this.timeSubscription = timer(0, 20000)
      .pipe(
        map(() => {
          console.log('Working ');
          this.setCurrentLocation();
          this.getOnTripOrders();
        }),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      this.getOnTripOrders();
    });
  }

  getOnTripOrders() {
    this.adminService.allOnTrip().subscribe((response: any) => {
      console.log('getOnTripOrders :: ', response);
      if (response && response.length > 0) {
        this.processOrders(response);
      } else if (response.data && response.data.length > 0) {
        this.processOrders(response);
      } else {
        this.processOrders([]);
        this.toastr.warning('Currently No Trips Found', 'No Trip Present', {
          timeOut: 7000,
        });
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

      console.log('orders Now', this.orders);
      this.hideSpinner();
      return this.setActiveOrder();
    }
    return this.bottomwrapperClose();
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
    this.hideBottomwrapper = false;
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
        this.router.navigate(['admin/dashboard']);
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
  // this.activeOrder.patient_id?.id - current patient id
  // this.janitriVitalsComponent
  this.janitriVitalsOverlay.nativeElement.style.width = "100%";

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
    this.timeSubscription.unsubscribe();
  }
}
