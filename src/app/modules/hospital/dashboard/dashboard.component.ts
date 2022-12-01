import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonEventsService } from 'src/app/common-events.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import { Label } from 'ng2-charts';
import {
  SingleDataSet,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  Label,
  MultiDataSet,
  Color,
} from 'ng2-charts';
import { HospitalService } from '../hospital.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dashBoardData: any;
  breadCrumbData: any = {
    heading: 'Dashboard',
    routing: [
      {
        routerHeading: 'dashboard',
        routerLink: '/hospital/dashboard',
      },
    ],
  };
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    // { data: [65, 59, 80, 81, 56, 55, 40]},
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Ride' },
  ];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: any[] = [
    ['Burn'],
    ['Cardiac'],
    ['Pregnancy'],
    ['Accident'],
  ];
  public pieChartData: SingleDataSet = [300, 500, 100, 170];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public doughnutChartLabels: Label[] = [
    'Total Patiens Supported',
    'Total Visitors',
    'Ambulance Availed',
  ];
  public doughnutChartData: MultiDataSet = [[350, 450, 100]];
  public doughnutChartType: ChartType = 'doughnut';

  public barChartOptions2: ChartOptions = {
    responsive: true,
  };
  public barChartLabels2: Label[] = [
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN',
  ];
  public barChartType2: ChartType = 'bar';
  public barChartLegend2 = true;
  public barChartPlugins2 = [];

  public barChartData2: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: '' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: '' },
  ];
  hospitalUser: any;
  hospitalData: any;
  patientData: any = 0;

  constructor(
    private commonEventService: CommonEventsService,
    private spinner: NgxSpinnerService,
    private hospitalService: HospitalService,
    private authService: AuthService,
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    console.log('faster', this.sidebarToggle);
    this.sidebarToggle = true;
  }

  ngOnInit(): void {
    this.hospitalUser = this.authService.getRole();
    console.log('fastest', this.sidebarToggle);
    this.sidebarToggle = false;
    this.showSpinner();
    this.getDashboardData();
    this.getHospitalData();
    this.getPatientCount();
  }
  getHospitalData() {
    this.hospitalService
      .getHospitalData(this.hospitalUser?.id)
      .subscribe((response: any) => {
        this.hospitalData = response.data;
        console.log('responseData', response.data);
      });
  }
  getDashboardData() {
    this.commonEventService.getDashboardDetails().subscribe((response: any) => {
      console.log('reports', response);

      this.dashBoardData = response.data[0];
    });
  }
  getPatientCount() {
    this.commonEventService
      .getAllPatientCountByOrders(this.hospitalUser.id)
      .subscribe((response: any) => {
        console.log('reports', response.data[0].patient_length);

        this.patientData = response.data[0].patient_length;
      });
  }

  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }

  //  Sidebar Toggle Click //
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
  //  Sidebar Toggle Click End//
}
