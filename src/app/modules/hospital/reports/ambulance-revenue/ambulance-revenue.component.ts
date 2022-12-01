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
  selector: 'app-ambulance-revenue',
  templateUrl: './ambulance-revenue.component.html',
  styleUrls: ['./ambulance-revenue.component.css'],
})
export class AmbulanceRevenueComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Ambulance Revenue',
    routing: [
      {
        routerHeading: 'ambulance-type',
        routerLink: '/hospital/reports/ambulance-revenue',
      },
    ],
  };
  sidebarToggle!: boolean;
  reportForm!: FormGroup;
  hospital_id: any;
  endDate: any;
  public totalRevenue: ChartDataSets[] = [
    { data: [], label: 'In House Revenue', backgroundColor: '#68A7AD' },
    { data: [], label: 'Out Revenue', backgroundColor: '#0AA1DD' },
  ];

  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Date',
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Total Revenue(in Rupees)',
          },
        },
      ],
    },
  };

  public barChartPlugins = [];
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
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
      ambulance_type_id: [0, []],
    });
  }

  ngOnInit(): void {
    // this.getAmbulanceType();
    this.showSpinner();
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
    this.totalRevenue[0].data = [];

    this.totalRevenue[0].data = [];
    this.barChartLabels = [];
    this.hospitalService
      .getHamsReportForHospital(
        this.hospital_id,
        'totalrevenuehospital',
        startDate,
        endDate,
        2,
      )
      .subscribe((response: any) => {
        console.log('report ', response);
        const data = response?.data[0];
        data.map((d: any) => {
          let date = d?.Date;
          console.log('dddddaattee', d.Date);

          let splitData = date ? date.toString().slice(0, 10) : '';
          this.barChartLabels.push(splitData);
          console.log('o><><><', splitData);

          this.totalRevenue.filter((item: any, index: any) => {
            console.log('item', item.label);
            if (d.Inhouserevenue) {
              this.totalRevenue[0].data?.push(d.Inhouserevenue);
              this.totalRevenue[0].label = 'In House Revenue';
            }
            if (d.outrevenue) {
              this.totalRevenue[1].data?.push(d.outrevenue);
              this.totalRevenue[1].label = 'Out Revenue';
            }
          });
        });
        console.log('this.totalRevenue ', this.totalRevenue);
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
