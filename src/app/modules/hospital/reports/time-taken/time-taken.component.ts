import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartColor, ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonEventsService } from 'src/app/common-events.service';
import { HospitalService } from '../../hospital.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-time-taken',
  templateUrl: './time-taken.component.html',
  styleUrls: ['./time-taken.component.css'],
})
export class TimeTakenComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Time Taken',
    routing: [
      {
        routerHeading: 'reports',
        routerLink: '/hospital/reports/time-taken',
      },
    ],
  };
  reportForm!: FormGroup;
  hospital_id: any;
  endDate: any;
  public timeTaken: any = [
    { data: [], label: 'Time Taken', backgroundColor: '#01b2c6' },
  ];

  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Hours And Minutes',
          },
          ticks: { beginAtZero: true, min: 0, stepSize: 1 }
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
    private commonEventService: CommonEventsService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private authService: AuthService,
  ) {
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      ambulance_type_id: [0, []],
    });
  }

  ngOnInit(): void {
    this.showSpinner();

    const hospital_details: any = this.authService.getRole();
    this.hospital_id = hospital_details.id;
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

    this.getReport(this.startDate, this.endDate);
  }
  getReport(startDate: any, endDate: any) {
    this.timeTaken[0].data = [];
    this.barChartLabels = [];
    this.hospitalService
      .getHamsReportForHospital(
        this.hospital_id,
        'timetaken',
        startDate,
        endDate,
        2,
      )
      .subscribe((response: any) => {

        const data = response?.data[0];
        if (data.length > 0) {
          this.message = true;
          data.filter((d: any) => {
            if (d.start_time != null && d.end_time != null) {

              let date = d.dateon ? d.dateon.split('T')[0] : '';
              this.barChartLabels.push(date);
              let time = d.end_time - d.start_time
              this.timeTaken[0].data.push(this.convertMsToHM(time).toString())
            }

          });

        } else {
          this.message = false;
        }
      });
  }

  onFilter() {
    this.startDate = this.reportForm.value['start_date'];
    this.endDate = this.reportForm.value['end_date'];
    this.getReport(this.startDate, this.endDate);

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

  convertMsToHM(milliseconds: any) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = seconds >= 30 ? minutes + 1 : minutes;

    minutes = minutes % 60;
    hours = hours % 24;

    return `${this.padTo2Digits(hours)}.${this.padTo2Digits(minutes)}`;
  }
  padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }

}
