import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-hospital-he-report',
  templateUrl: './hospital-he-report.component.html',
  styleUrls: ['./hospital-he-report.component.css']
})
export class HospitalHeReportComponent implements OnInit {
  public heHospitals: any = [
    { data: [], label: 'He Type', backgroundColor: '#68A7AD' }
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
  breadCrumbData: any = {
    heading: 'He Reports',
    routing: [
      {
        routerHeading: 'he reports',
        routerLink: '/admin/hospital-he-report',
      },
    ],
  };
  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.getheTypeReport()
  }
  getheTypeReport() {
    this.reportService.getHospitalReportByHeTypes().subscribe((response: any) => {
      console.log(response);
      response.map((res: any, index: any) => {
        this.heHospitals[0].data.push(res.totalHospitals);
        this.barChartLabels.push(res.htName)
        // this.pieChartColors[0].backgroundColor.push(colors[index]);
      });
    }, (error: any) => {
      console.log(error);

    })
  }

}
