import { KioskService } from './../kiosk.service';
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
import { map, Subscription, timer } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DriverService } from '../../driver/driver.service';
import { HospitalService } from '../../hospital.service';

@Component({
  selector: 'app-live-kiosks',
  templateUrl: './live-kiosks.component.html',
  styleUrls: ['./live-kiosks.component.css'],
})
export class LiveKiosksComponent implements OnInit, AfterViewInit, OnDestroy {
  latitude = 28.70406;
  longitude = 77.102493;
  zoom = 8;
  private geoCoder: any;
  sidebarToggle!: boolean;
  sideToggle: boolean = true;
  address: string = '';
  drivers: Array<any> = [];
  incomingSelectedIndex: number = 0;
  activeOrder: any = null;
  mapFullScreen: boolean = false;
  @ViewChild('fullScreen') public fullScreen!: ElementRef;
  base_url: string = environment.BASE_URL;
  isCloseClicked: boolean = false;
  breadCrumbData: any = {
    heading: '',
  };
  searchedName: any = '';
  searchedPhone: any = '';
  searchedAmbulance: any = '';
  clearFilter: boolean = false;
  timerSubscription!: Subscription;
  updateToggle: boolean = false;
  driverLength: any;
  hospitalId: any;

  constructor(
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private toastr: ToastrService,

    private driverService: DriverService,
    private kioskService: KioskService,
  ) { }

  ngOnInit(): void {
    let user: any = sessionStorage.getItem('kiosks');
    let hospitalDetails = JSON.parse(user);
    console.log('**hospitalDetails**', hospitalDetails);
    this.hospitalId = hospitalDetails.id;

    // this.hospital_id
    this.timerSubscription = timer(0, 20000)
      .pipe(
        map(() => {
          this.getAvailableDrivers();
          // load data contains the http request
        }),
      )
      .subscribe();
    // this.showSpinner();
  }

  ngAfterViewInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      this.getAvailableDrivers();
    });
  }

  getAvailableDrivers() {
    this.kioskService
      .getAllQueueDriversByHospitalId(this.hospitalId)
      .subscribe((response: any) => {
        console.log('getAvailableDrivers :: ', response);
        if (response.data && response.data.length > 0) {
          this.driverLength = response.data.length;
          this.processDrivers(response.data);
        } else if (response.data && response.data.length > 0) {
          this.processDrivers(response.data);
        } else {
          this.toastr.warning(
            'Currently There Are No Driver Available',
            'No Ambulance Present',
            {
              timeOut: 2000,
            },
          );
          this.hideSpinner();
        }
      });

  }

  processDrivers(results: any) {
    // console.log('res', results);
    this.drivers = [];
    this.drivers = results.map((r: any, i: number) => {
      // console.log('>>>>', r);

      return {
        ...r,
        latitude: Number(r?.drivers?.lat),

        longitude: Number(r?.drivers?.lon),

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
    console.log('res', this.drivers);

    // console.log("drivers ", this.drivers);
    this.hideSpinner();
    // this.setActiveOrder();
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
        // this.getAddress(this.latitude, this.longitude);
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
  // filter by name
  onNameFilter(event: any) {
    this.searchedAmbulance = '';
    this.searchedPhone = '';
    this.searchedName = event.target.value;
  }
  onPhoneFilter(event: any) {
    this.searchedAmbulance = '';

    this.searchedName = '';
    this.searchedPhone = event.target.value;
  }
  onAmbulanceFilter(event: any) {
    this.searchedPhone = '';
    this.searchedName = '';
    this.searchedAmbulance = event.target.value;
  }
  onSearchDriver() {
    if (this.searchedPhone != '') {
      this.driverService
        .filterDriverByPhone(this.searchedPhone)
        .subscribe((response: any) => {
          console.log('response:', response);
          if (!response.success || response.data.length > 0) {
            this.processDrivers(response.data);
            this.latitude = Number(response.data[0].lat)
              ? Number(response.data[0].lat)
              : 28.70406;
            this.longitude = Number(response.data[0].lon)
              ? Number(response.data[0].lon)
              : 77.102493;
            console.log('lat', this.latitude);
            console.log('lon', this.longitude);
            this.clearFilter = true;
          }
        });
    } else if (this.searchedName != '') {
      this.driverService
        .filterDriverByName(this.searchedName)
        .subscribe((response: any) => {
          console.log('response:', response);
          if (!response.success || response.data.length > 0) {
            this.processDrivers(response.data);
            this.latitude = Number(response.data[0].lat)
              ? Number(response.data[0].lat)
              : 28.70406;
            this.longitude = Number(response.data[0].lon)
              ? Number(response.data[0].lon)
              : 77.102493;
            console.log('lat', this.latitude);
            console.log('lon', this.longitude);
            this.clearFilter = true;
          }
        });
    } else if (this.searchedAmbulance != '') {
      this.driverService
        .filterDriverByAmbulance(this.searchedAmbulance)
        .subscribe((response: any) => {
          console.log('response:', response);
          if (!response.success || response.data.length > 0) {
            this.processDrivers(response.data);
            this.latitude = Number(response.data[0].lat)
              ? Number(response.data[0].lat)
              : 28.70406;
            this.longitude = Number(response.data[0].lon)
              ? Number(response.data[0].lon)
              : 77.102493;
            console.log('lat', this.latitude);
            console.log('lon', this.longitude);

            this.clearFilter = true;
          }
        });
    }
  }
  onClearSearch() {
    this.reloadCurrentRoute();
    this.clearFilter = false;
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
      console.log(currentUrl);
    });
  }

  onToggleClick() {
    this.sideToggle = !this.sideToggle;
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }
  onStatusChange() {
    this.updateToggle = !this.updateToggle;
  }
}
