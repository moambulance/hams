import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HospitalService } from 'src/app/modules/hospital/hospital.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  host: { id: 'left-sidebar', class: 'sidebar' },
})
export class SidebarComponent implements OnInit {
  master: boolean = false;
  iot: boolean = true;
  reports: boolean = true;
  help: boolean = true;
  hospitalDetails: any;
  baseUrl: any = environment.BASE_URL;
  id: any;
  routeActive: any;
  constructor(
    private authService: AuthService,
    private hospitalService: HospitalService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.master =
      this.router.url === '/hospital/reports/total-rides' ||
      this.router.url === '/hospital/reports/ambulance-type' ||
      this.router.url === '/hospital/reports/patient-type' ||
      this.router.url === '/hospital/reports/time-taken' ||
      this.router.url === '/hospital/reports/patient-condition' ||
      this.router.url === '/hospital/reports/patient-location' ||
      this.router.url === '/hospital/reports/moAmbulance-patient' ||
      this.router.url === '/hospital/reports/ambulance-revenue';
    let id: any = this.authService.getRole()['id'];
    this.hospitalService?.getHospitalById(id)?.subscribe((response: any) => {


      this.hospitalDetails = response;

    });

  }
  onClickMaster() {
    this.master = !this.master;

  }
  onClickIot() {
    this.iot = !this.iot;
  }
  onClickReports() {
    this.reports = !this.reports;
  }
  onClickHelp() {
    this.help = !this.help;
  }
}
