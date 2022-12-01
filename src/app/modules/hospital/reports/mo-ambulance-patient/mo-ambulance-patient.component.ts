import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonEventsService } from 'src/app/common-events.service';
import { HospitalService } from '../../hospital.service';

@Component({
  selector: 'app-mo-ambulance-patient',
  templateUrl: './mo-ambulance-patient.component.html',
  styleUrls: ['./mo-ambulance-patient.component.css'],
})
export class MoAmbulancePatientComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'MoAmbulance Patient',
    routing: [
      {
        routerHeading: 'reports',
        routerLink: '/hospital/reports/moAmbulance-patient',
      },
    ],
  };
  reportForm!: FormGroup;
  hospital_id: any = 0;
  endDate: any;
  public moPatients: ChartDataSets[] = [
    { data: [], label: 'Rides', backgroundColor: '#01b2c6' },
  ];

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
    // const token: any = sessionStorage.getItem('token');
    const hospital_details: any = this.authService.getRole();
    this.hospital_id = hospital_details.id;
    console.log('this.authService.getRole();', hospital_details);
    if (this.hospital_id != 0) {
      this.intialReports();
    }
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
    this.hospitalService
      .getMoAmbulancePatientReport(startDate, endDate, this.hospital_id)
      .subscribe((response: any) => {
        const data = response?.data;
        console.log('report ', data);
        if (data?.length > 0) {
          this.message = true;
          this.moPatients[0].data = data.map((d: any) => {
            console.log('d', d);

            this.barChartLabels.push(d?.Date.split('T')[0]);
            return d.totalPatient;
          });
        } else {
          this.message = false;
        }
        console.log('this.moPatients[ ', this.moPatients);
        console.log('this.barChartLabels', this.barChartLabels);
      });
  }

  onFilter() {
    // console.log()
    this.startDate = this.reportForm.value['start_date'];
    this.endDate = this.reportForm.value['end_date'];
    this.getReport(this.startDate, this.endDate);
    console.log('start date ', this.reportForm.value['start_date']);
    console.log('end date ', this.reportForm.value['end_date']);
    console.log('AT_id ', this.reportForm.value['ambulance_type_id']);
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
