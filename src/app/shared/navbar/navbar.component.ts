import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { map, timer } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HospitalService } from 'src/app/modules/hospital/hospital.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userDetails: any;
  baseUrl: string = environment.BASE_URL;
  hospitalDetails: any;
  hospitalImage: any;
  orderCount = 0;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  timerSubscription: any;
  CURRENT_URL!: string;
  play: boolean = true;
  constructor(
    private authService: AuthService,
    private hospitalService: HospitalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // const token: any = sessionStorage.getItem('token');
    this.CURRENT_URL = this.router.url;
    this.userDetails = this.authService.getRole();

    this.getOrderOnTripCountByHospital(this.userDetails?.id);
    this.authService
      .getHospitalById(this.userDetails?.id)
      .subscribe((response: any) => {
        this.hospitalDetails = response;
        this.hospitalImage = this.baseUrl + response?.logo;
      });
    this.timerSubscription = timer(0, 20000)
      .pipe(
        map(() => {
          this.getOrderOnTripCountByHospital(this.userDetails?.id);

          // load data contains the http request
        }),
      )
      .subscribe();

    // this.showSpinner();
  }
  onLogout() {
    this.authService.onHospitalLogout();
    this.router.navigate(['/login']);
  }
  onKioskLogout() {
    this.authService.onHospitalLogout();
    this.router.navigate(['/login']);
  }

  getOrderOnTripCountByHospital(hospitalId: any) {
    this.hospitalService
      .getOrderOnTripCountByHospital(hospitalId)
      .subscribe((response: any) => {
        this.orderCount = Number(response?.onTripCount);
        if (this.orderCount > 0) this.playSiren();
      });
  }

  playSiren() {
    if (this.play) {
      this.audioPlayer.nativeElement.play();
    } else {
      this.audioPlayer.nativeElement.pause();
    }
  }
  onAmbulanceClick() {
    if (this.orderCount > 0) {
      return this.router.navigate(['hospital/live-ambulance']);
    }
    return;
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.timerSubscription.unsubscribe();
  }
  pauseSiren() {
    this.play = !this.play;
    this.playSiren();
  }
  soundDecrease() {
    this.audioPlayer.nativeElement.volume = 0.1;
  }
  soundIncrease() {
    this.audioPlayer.nativeElement.volume = 0.1;
  }
}
