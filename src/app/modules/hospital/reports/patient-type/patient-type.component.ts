import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartOptions, ChartType } from 'chart.js';
import { SingleDataSet } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonEventsService } from 'src/app/common-events.service';
import { HospitalService } from '../../hospital.service';

@Component({
  selector: 'app-patient-type',
  templateUrl: './patient-type.component.html',
  styleUrls: ['./patient-type.component.css'],
})
export class PatientTypeComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Patient Type',
    routing: [
      {
        routerHeading: 'reports',
        routerLink: '/hospital/reports/patint-type',
      },
    ],
  };

  sidebarToggle!: boolean;
  reportForm!: FormGroup;
  hospital_id: any;
  endDate: any;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: any[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: ['#18b3c5', 'rgba(189,33,48,1)', 'rgba(216,216,216,1)'],
    },
  ];
  startDate: any;
  constructor(
    private commonEventService: CommonEventsService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private authService: AuthService,
  ) {
    this.sidebarToggle = false;
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.showSpinner();
    const token: any = sessionStorage.getItem('token');
    const hospital_details: any = this.authService.getRole();
    this.hospital_id = hospital_details.id;
    this.getReport(22, 22, 'TotalPatientType');
  }

  getReport(startDate: any, endDate: any, patientType: any) {
    this.hospitalService
      .getHamsReportForHospital(
        this.hospital_id,
        patientType,
        startDate,
        endDate,
        2,
      )
      .subscribe((response: any) => {
        console.log('report ', response);
        const data = response?.data[0];
        this.pieChartLabels = data.map((d: any) => {
          return [d.name];
        });
        this.pieChartData = data.map((s: any) => {
          return s.totalpatient;
        });
        // this.totalRides[0].data = data.map((d: any) => {
        //   this.barChartLabels.push(d.Date.split("T")[0]);
        //   return d.TotalRide;
        // });
        // console.log("this.totalRides[ ", this.totalRides);
      });
  }

  onFilter() {
    // console.log()
    this.startDate = this.reportForm.value['start_date'];
    this.endDate = this.reportForm.value['end_date'];
    this.getReport(this.startDate, this.endDate, 'TotalPatienttypedatewise');
    console.log('start date ', this.reportForm.value['start_date']);
    console.log('end date ', this.reportForm.value['end_date']);
    // console.log('AT_id ', this.reportForm.value['ambulance_type_id']);
  }
  get start_date() {
    return this.reportForm.get('start_date');
  }

  get end_date() {
    return this.reportForm.get('end_date');
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
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
