import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonEventsService } from 'src/app/common-events.service';
import { environment } from 'src/environments/environment';
import { AmbulanceService } from '../ambulance.service';

@Component({
  selector: 'app-ambulance-details',
  templateUrl: './ambulance-details.component.html',
  styleUrls: ['./ambulance-details.component.css'],
})
export class AmbulanceDetailsComponent implements OnInit {
  ambulanceId: any;
  ambulanceDetails: any;
  baseUrl: string = environment.BASE_URL;
  breadCrumbData: any = {
    heading: 'Ambulance Details',
    routing: [
      {
        routerHeading: 'ambulance',
        routerLink: '/hospital/ambulance',
      },
      {
        routerHeading: 'ambulance-details',
        routerLink: '/hospital/ambulance/ambulance-details',
      },
    ],
  };
  constructor(
    private spinner: NgxSpinnerService,
    private commonEventService: CommonEventsService,
    private ambulanceService: AmbulanceService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: any) => {
      this.ambulanceId = param.get('id');
      console.log(this.ambulanceId);
    });
    this.getAmbulanceDetails(this.ambulanceId);
  }
  getAmbulanceDetails(id: any) {
    this.ambulanceService.getAmbulanceById(id).subscribe((result: any) => {
      this.ambulanceDetails = result;
      console.log('this.ambulanceDetails', this.ambulanceDetails);
    });
  }
  // Spinner
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  // Sidebar Toggle
  sidebarToggle!: boolean;
  onToggleClick() {
    if (this.sidebarToggle) {
      this.sidebarToggle = !this.sidebarToggle;
      this.commonEventService.onSidebarToggle(this.sidebarToggle);
    } else {
      this.sidebarToggle = !this.sidebarToggle;
      this.commonEventService.onSidebarToggle(this.sidebarToggle);
    }
  }
}
