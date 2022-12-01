import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AdminService } from '../../admin.service';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-onboarded-hospital',
  templateUrl: './onboarded-hospital.component.html',
  styleUrls: ['./onboarded-hospital.component.css'],
})
export class OnboardedHospitalComponent implements OnInit {
  latitude = 28.70406;
  longitude = 77.102493;
  zoom = 8;
  private geoCoder: any;
  sidebarToggle!: boolean;
  sideToggle: boolean = true;
  address: string = '';
  hospitals: Array<any> = [];
  incomingSelectedIndex: number = 0;
  activeHospital: any;
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
  hospitalLength: any;
  showHospital: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private toastr: ToastrService,
    private adminService: AdminService,
    private hospitalService: HospitalService,
  ) {}

  ngOnInit(): void {
    this.getAvailablehospitals();
  }

  ngAfterViewInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      this.getAvailablehospitals();
    });
  }

  getAvailablehospitals() {
    this.hospitalService
      .getAllActiveApprovedHospital()
      .subscribe((response: any) => {
        console.log('getAvailablehospitals :: ', response);
        if (response && response.length > 0) {
          this.hospitalLength = response.length;
          this.processHospitals(response);
        } else if (response && response.length > 0) {
          this.processHospitals(response);
        } else {
          this.toastr.warning(
            'Currently Tere Are No hospital Available',
            'No Trip Present',
            {
              timeOut: 7000,
            },
          );
          this.hideSpinner();
        }
      });
  }

  processHospitals(results: any) {
    // console.log('res', results);
    this.hospitals = [];
    this.hospitals = results.map((r: any, i: number) => {
      // console.log('location: "20.291300, 85.862220"', r);

      return {
        ...r,
        latitude: Number(r.location.split(',')[0]),

        longitude: Number(r.location.split(',')[1]),

        icon: {
          url: 'assets/images/location-hospital.png',
          scaledSize: {
            width: 40,
            height: 40,
          },
        },
        isMarker: false,
        isActive: i == this.incomingSelectedIndex ? true : false,
      };
    });
    console.log('res', this.hospitals);

    // console.log("hospitals ", this.hospitals);
    this.hideSpinner();
    // this.setactiveHospital();
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
      });
    } else {
      console.log('no navigator found');
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
    // this.searchedAmbulance = '';
    // this.searchedPhone = '';
    this.searchedName = event.target.value;
  }
  // onPhoneFilter(event: any) {
  //   this.searchedAmbulance = '';

  //   this.searchedName = '';
  //   this.searchedPhone = event.target.value;
  // }
  // onAmbulanceFilter(event: any) {
  //   this.searchedPhone = '';
  //   this.searchedName = '';
  //   this.searchedAmbulance = event.target.value;
  // }

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

  // ngOnDestroy(): void {
  //   this.timerSubscription.unsubscribe();
  // }
  onStatusChange() {
    this.updateToggle = !this.updateToggle;
  }
  onSearchHospital() {
    this.hospitalService
      .filterHospitalByName(this.searchedName)
      .subscribe((response: any) => {
        console.log('response:', response);
        if (!response.success || response.length > 0) {
          this.processHospitals(response);
          this.latitude = response[0].location
            ? Number(response[0].location.split(',')[0])
            : 28.70406;
          this.longitude = response[0].location
            ? Number(response[0].location.split(',')[1])
            : 77.102493;
          console.log('lat', this.latitude);
          console.log('lon', this.longitude);
          this.clearFilter = true;
        }
      });
  }

  hospitalDetails(hospital: any) {
    this.showHospital = !this.showHospital;
    hospital.isMarker = this.showHospital;
    this.activeHospital = hospital;
    console.log('hospital', hospital);
  }
  bottomwrapperClose() {
    this.showHospital = false;
  }
}
