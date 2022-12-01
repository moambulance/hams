import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonEventsService } from 'src/app/common-events.service';
import { HospitalService } from '../../hospital.service';
import * as moment from 'moment';
import { AmbulanceService } from '../../ambulance/ambulance.service';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-ambulance-type',
  templateUrl: './ambulance-type.component.html',
  styleUrls: ['./ambulance-type.component.css'],
})
export class AmbulanceTypeComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Ambulance Type',
    routing: [
      {
        routerHeading: 'ambulance-type',
        routerLink: '/hospital/reports/ambulance-type',
      },
    ],
  };
  sidebarToggle!: boolean;
  reportForm!: FormGroup;
  hospital_id: any;
  endDate: any;
  backgroundColor: any = [
    '#68A7AD',
    '#0AA1DD',
    '#006E7F',
    '#F8CB2E',
    '#E4AEC5',
    '#5534A5',
    '#4E944F',
  ];
  public totalAmbulance: any = [
    // { data: [], label: '', backgroundColor: '#68A7AD' },
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
  ambulanceTypes: any;
  selectedAmbulanceType: number = 0;
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Hospital List.xlsx';
  isVisible: boolean = false;

  constructor(
    private commonEventService: CommonEventsService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private ambulanceService: AmbulanceService,
    private authService: AuthService,
  ) {
    this.sidebarToggle = false;
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      ambulance_type_id: [0, []],
    });
    this.reportForm.controls['ambulance_type_id'].setValue(0);
  }

  ngOnInit(): void {
    this.getAmbulanceType();
    this.showSpinner();
    const hospital_details: any = this.authService.getRole();
    this.hospital_id = hospital_details.id;
    console.log('this.authService.getRole();', hospital_details);
    if (this.hospital_id != 0) {
      this.intialReports();
    }
  }
  // getAllAmbulanceTypes() {
  //   return this.http.get(this.baseUrl + 'master/ambulance-type/all');
  // }
  getAmbulanceType() {
    this.ambulanceService.getAllAmbulanceTypes().subscribe((response: any) => {
      this.totalAmbulance = [];

      this.ambulanceTypes = response.filter((res: any, index: any) => {
        if (res.is_active === 1) {
          // console.log('ambulanceTypes', res);

          this.totalAmbulance.push({
            data: [],
            label: res.name,
            backgroundColor: this.backgroundColor[index],
          });

          return res;
        }
      });
    });
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
      .getHamsReportForHospital(
        this.hospital_id,
        'ambulancetypedatewise',
        startDate,
        endDate,
        this.selectedAmbulanceType,
      )
      .subscribe((response: any) => {
        console.log('report ', response.data[0]);
        const data = response?.data[0];
        console.log('ssss', data);

        if (data.length > 0) {
          this.message = true;
          data.map((d: any) => {
            let date = d?.Date;

            let splitData = date ? date.toString().slice(0, 10) : '';
            this.barChartLabels.push(splitData);

            this.totalAmbulance.map((item: any, index: any) => {
              console.log('item', item.label);

              if (d.name === item.label) {
                this.totalAmbulance[index].data?.push(d.talAmbulance);
              } else {
                this.totalAmbulance[index].data?.push(0);
              }
            });
          });
        } else {
          this.message = false;
        }
      });
  }

  onFilter() {
    if (this.selectedAmbulanceType == 0) {
      // this.totalAmbulance = [{ data: [], label: '', backgroundColor: '#FFF' }];
      this.barChartLabels = [];
      this.getAmbulanceType();
      this.getFilteredData();
    } else if (this.selectedAmbulanceType >= 1) {
      this.barChartLabels = [];
      this.totalAmbulance = [];
      this.ambulanceTypes.filter((item: any, index: any) => {
        console.log('>>>>', item.id == this.selectedAmbulanceType);
        console.log('>>>>', this.selectedAmbulanceType);
        console.log('>>>>', item.id);
        if (item.id == this.selectedAmbulanceType) {
          this.totalAmbulance = [
            {
              data: [],
              label: item.name,
              backgroundColor: this.backgroundColor[index],
            },
          ];
          this.getFilteredData();
        }
      });
    }
  }
  getFilteredData() {
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
  onAmbulanceTypeChange(e: any) {
    console.log('eeeeeeeee', e.target.value);
    this.selectedAmbulanceType = e.target.value;
  }

  exportExcel(): void {
    this.isVisible = true;
    setTimeout(() => {
      /* pass here the table id */
      let element: HTMLElement = this.excelTable.nativeElement as HTMLElement;
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      XLSX.writeFile(wb, this.fileName);

      this.isVisible = false;
    });
  }
}
