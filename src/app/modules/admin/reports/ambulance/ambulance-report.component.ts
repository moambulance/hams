import { ReportService } from '../report.service';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { colors } from '../../shared/utils/colors';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ambulance-report',
  templateUrl: './ambulance-report.component.html',
  styleUrls: ['./ambulance-report.component.css'],
})
export class AmbulanceReportComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Ambulance Reports',
    routing: [
      {
        routerHeading: 'ambulance report',
        routerLink: '/admin/total-ambulance',
      },
    ],
  };
  // bar chart variables
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];
  totalAmbulances: any = [
    { data: [], label: 'Total Ambulances', backgroundColor: '#63b598' },
    { data: [], label: 'ALS', backgroundColor: '#ce7d78' },
    { data: [], label: 'BLS', backgroundColor: '#ea9e70' },
    { data: [], label: 'MORTUARY', backgroundColor: '#a48a9e' },
  ];
  barChartLabels: any = [];
  // Pie chart variables
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false,
      position: 'right',
    },
  };

  public hospitalLabels: Label[] = [];
  public hospitalData: any = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Array<any> = [
    {
      backgroundColor: [],
    },
  ];
  constructor(
    private reportService: ReportService,
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
    this.ambulanceReport();
    this.hospitalReport();
  }

  hospitalReport() {
    this.reportService.getHospitalWithAmbulance().subscribe(
      (response: any) => {
        response.data.map((res: any, index: any) => {
          this.hospitalLabels.push(res.hospitalName);
          this.hospitalData.push(res.talAmbulance);
          this.pieChartColors[0].backgroundColor.push(colors[index]);
        });
      },
      ({ error }: any) => {
        this.toaster.error(error.message);
      },
    );
  }

  ambulanceReport() {
    this.reportService.getAmbulancesByTypeReport().subscribe(
      (response: any) => {
        this.totalAmbulances.map((data: any, index: any) => {
          this.barChartLabels.push(data.label);
          response.data.map((res: any) => {
            if (data.label == res.name) {
              this.totalAmbulances[index].data.push(res.talAmbulance);
            } else {
              this.totalAmbulances[index].data.push(0);
            }
          });
        });
      },
      ({ error }: any) => {
        this.toaster.error(error.message);
      },
    );
  }
}
