import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { TotalRidesService } from './total-rides.service';

@Component({
  selector: 'app-total-rides',
  templateUrl: './total-rides.component.html',
  styleUrls: ['./total-rides.component.css'],
})
export class TotalRidesComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Total Rides',
    routing: [
      {
        routerHeading: 'reports',
        routerLink: '/admin/total-rides',
      },
    ],
  };
  sidebarToggle!: boolean;
  reportForm!: FormGroup;
  hospital_id: any = 0;
  endDate: any;
  type: string = 'TOTAL';
  public totalRides: any;

  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  public barChartPlugins = [];
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
  startDate: any;
  message: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private rideService: TotalRidesService,
    private formBuilder: FormBuilder,
  ) {
    this.sidebarToggle = false;
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      order_by: ['', [Validators.required]],
    });
    this.reportForm.controls['order_by'].setValue('TOTAL');
  }

  ngOnInit(): void {
    this.showSpinner();

    this.intialReports();
  }
  intialReports() {
    let date30 = moment().subtract(30, 'days').calendar();
    let month = date30.slice(0, 2);
    let day = date30.slice(3, 5);
    let year = date30.slice(6, 10);
    this.startDate = year + '-' + month + '-' + day;
    this.endDate = moment().format().slice(0, 10);
    this.reportForm.patchValue({
      start_date: this.startDate,
      end_date: this.endDate,
    });

    this.getReport(this.type, this.startDate, this.endDate);
  }
  getReport(type: any, startDate: any, endDate: any) {
    switch (this.type) {
      case (this.type = 'ALL'):
        this.totalRides = [
          { data: [], label: 'B2C', backgroundColor: '#01b2c6' },
          { data: [], label: 'Hospital', backgroundColor: '#ce7d78' },
          { data: [], label: 'Mo Admin', backgroundColor: '#ea9e70' },
        ];
        this.barChartLabels = [];
        this.rideService.getTotalRides(type, startDate, endDate).subscribe(
          (response: any) => {
            console.log('res', response);

            if (response.data.length > 0) {
              this.message = true;
              response.data.map((d: any) => {
                this.barChartLabels.push(d.Date.split('T')[0]);
                this.totalRides.map((item: any, index: any) => {
                  if (item.label === d.order_by) {
                    this.totalRides[index].data.push(d.TotalRide);
                  } else {
                    this.totalRides[index].data?.push(0);
                  }
                });
              });
            } else {
              this.message = false;
            }
          },
          (error: any) => {
            this.message = false;
            console.log('error', error);
          },
        );
        break;
      case (this.type = 'MoAdmin'):
        this.totalRides = [
          { data: [], label: 'Mo Admin Rides', backgroundColor: '#01b2c6' },
        ];
        this.barChartLabels = [];
        this.rideService.getTotalRides(type, startDate, endDate).subscribe(
          (response: any) => {
            if (response.data.length > 0) {
              this.message = true;
              this.totalRides[0].data = response.data.map((d: any) => {
                this.barChartLabels.push(d.Date.split('T')[0]);
                return d.TotalRide;
              });
            } else {
              this.message = false;
            }
          },
          (error: any) => {
            this.message = false;
            console.log('error', error);
          },
        );
        break;

      case (this.type = 'Hospital'):
        this.totalRides = [
          { data: [], label: 'Hospital Rides', backgroundColor: '#01b2c6' },
        ];
        this.barChartLabels = [];
        this.rideService.getTotalRides(type, startDate, endDate).subscribe(
          (response: any) => {
            console.log('res', response);

            if (response.data.length > 0) {
              this.message = true;
              this.totalRides[0].data = response.data.map((d: any) => {
                this.barChartLabels.push(d.Date.split('T')[0]);
                return d.TotalRide;
              });
            } else {
              this.message = false;
            }
          },
          (error: any) => {
            this.message = false;
            console.log('error', error);
          },
        );
        break;
      case (this.type = 'B2C'):
        this.totalRides = [
          {
            data: [],
            label: 'B2C Rides',
            backgroundColor: '#01b2c6',
          },
        ];
        this.barChartLabels = [];

        this.rideService.getTotalRides(type, startDate, endDate).subscribe(
          (response: any) => {
            console.log('res', response);

            if (response.data.length > 0) {
              this.message = true;
              this.totalRides[0].data = response.data.map((d: any) => {
                this.barChartLabels.push(d.Date.split('T')[0]);
                return d.TotalRide;
              });
            } else {
              this.message = false;
            }
          },
          (error: any) => {
            this.message = false;
            console.log('error', error);
          },
        );
        break;

      default:
        console.log('aaa', type);

        this.totalRides = [
          {
            data: [],
            label: 'Total Rides',
            backgroundColor: '#01b2c6',
          },
        ];
        this.barChartLabels = [];
        this.rideService.getTotalRides(type, startDate, endDate).subscribe(
          (response: any) => {
            console.log('res', response);

            if (response.data.length > 0) {
              this.message = true;
              this.totalRides[0].data = response.data.map((d: any) => {
                this.barChartLabels.push(d.Date.split('T')[0]);
                return d.TotalRide;
              });
            } else {
              this.message = false;
            }
          },
          (error: any) => {
            this.message = false;
            console.log('error', error);
          },
        );
        break;
    }
  }

  onFilter() {
    this.type = this.reportForm.value['order_by'];

    this.barChartLabels = [];
    // console.log()
    let startDate = this.reportForm.value['start_date'];
    let endDate = this.reportForm.value['end_date'];
    this.getReport(this.type, startDate, endDate);
  }

  get start_date() {
    return this.reportForm.get('start_date');
  }

  get end_date() {
    return this.reportForm.get('end_date');
  }

  get ambulance_type_id() {
    return this.reportForm.get('ambulance_type_id');
  }

  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
}
