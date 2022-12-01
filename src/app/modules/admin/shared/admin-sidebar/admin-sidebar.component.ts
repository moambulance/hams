import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'],
})
export class AdminSidebarComponent implements OnInit {
  master: boolean = false;
  hType: boolean = false;
  reports: boolean = false;
  otherService: boolean = false;
  iot: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.hType =
      this.router.url === '/admin/hospitals' ||
      this.router.url === '/admin/hospitals-user' ||
      this.router.url === '/admin/kiosks';
    this.iot = this.router.url === '/admin/iot/medtel';
    this.otherService =
      this.router.url === '/admin/medicine-delivery' ||
      this.router.url === '/admin/pathology' ||
      this.router.url === '/admin/doctor-consultation' ||
      this.router.url === '/admin/homecare';
    this.reports =
      this.router.url === '/admin/total-ambulance' ||
      this.router.url === '/admin/ambulance-rides' ||
      this.router.url === '/admin/driver-rides' ||
      this.router.url === '/admin/total-rides' ||
      this.router.url === '/admin/hospital-to-hospital' ||
      this.router.url === '/admin/hospital-he-report' ||
      this.router.url === '/admin/hospital-rides';
    this.master =
      this.router.url === '/admin/hospital-type' ||
      this.router.url === '/admin/hospital-departments' ||
      this.router.url === '/admin/hospital-service' ||
      this.router.url === '/admin/medicines' ||
      this.router.url === '/admin/test-type' ||
      this.router.url === '/admin/advertise' ||
      this.router.url === '/admin/suffering' ||
      this.router.url === '/admin/specialist-type' ||
      this.router.url === '/admin/service-type' ||
      this.router.url === '/admin/hType-companies' ||
      this.router.url === '/admin/ambulance-type';
  }
  onClickMaster() {
    this.master = !this.master;
    console.log('after', this.master);
  }
  onClickhType() {
    this.hType = !this.hType;
  }
  onClickReports() {
    this.reports = !this.reports;
  }
  onClickOtherService() {
    this.otherService = !this.otherService;
  }
  onClickIot() {
    this.iot = !this.iot;
  }
}
