import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { CommonEventsService } from 'src/app/common-events.service';
import {
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  MultiDataSet,
  SingleDataSet,
} from 'ng2-charts';
import { OrdersService } from '../orders/orders.service';
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
        routerLink: '/admin/dashboard',
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

  constructor(
    private commonEventService: CommonEventsService,
    private spinner: NgxSpinnerService,
    private orderService: OrdersService,
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    console.log('faster', this.sidebarToggle);
    this.sidebarToggle = true;
  }

  ngOnInit(): void {
    console.log('fastest', this.sidebarToggle);
    this.sidebarToggle = false;
    this.showSpinner();
    this.getDashboardData();
  }

  getDashboardData() {
    this.commonEventService.getDashboardDetails().subscribe((response: any) => {
      this.dashBoardData = response.data[0];
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
