import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { HospitalService } from '../../hospitals/hospital.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-hospital-to-hospital',
  templateUrl: './hospital-to-hospital.component.html',
  styleUrls: ['./hospital-to-hospital.component.css']
})
export class HospitalToHospitalComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Hospital To Hospital Rides',
    routing: [
      {
        routerHeading: 'reports',
        routerLink: '/admin/hospital-to-hospital',
      },
    ],
  };
  sidebarToggle!: boolean;
  reportForm!: FormGroup;
  hospital_id: any = 0;
  destination_hospital_id: any = 0
  endDate: any;
  type: string = 'TOTAL';
  public totalRides: any = [
    { data: [], label: 'Hospital to Hospital Rides', backgroundColor: '#01b2c6' }]

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
  hospitalList: any;
  hospitalListDest: any;
  constructor(
    private spinner: NgxSpinnerService,
    private reportService: ReportService,
    private hospitalService: HospitalService,
    private formBuilder: FormBuilder,
  ) {
    this.sidebarToggle = false;
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      source: ['', [Validators.required]],
      destination: ['', [Validators.required]],
    });
    this.reportForm.controls['source'].setValue(0)
    this.reportForm.controls['destination'].setValue(0)
  }

  ngOnInit(): void {
    this.getAllHospitals()
    this.showSpinner();

    this.intialReports();
  }
  getAllHospitals() {
    this.hospitalService.getAllActiveApprovedHospital().subscribe((hospitals: any) => {
      console.log(hospitals)
      this.hospitalList = hospitals
      this.hospitalListDest = hospitals

    }, (error: any) => {
      console.log(error)
    })
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


  }
  getReport(source: any, destination: any, startDate: any, endDate: any) {
    this.reportService.getHospitalToHospitalRides(source, destination, startDate, endDate).subscribe((report: any) => {
      console.log(report);
      this.totalRides[0].data = report.data.map((d: any) => {
        this.message = true
        this.barChartLabels.push(d.source + '-' + d.destination)
        console.log('====================================');
        console.log(d);
        console.log('====================================');
        return d.totalRides;
      });
      console.log('====================================');
      console.log(this.totalRides);
      console.log('====================================');
    }, (error: any) => { })
  }

  onFilter() {
    let source = this.reportForm.value['source'];
    let destination = this.reportForm.value['destination'];


    // console.log()
    let startDate = this.reportForm.value['start_date'];
    let endDate = this.reportForm.value['end_date'];
    this.getReport(source, destination, startDate, endDate);
    console.log(source, destination);

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
