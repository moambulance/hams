import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { DriverService } from './driver.service';
import { ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponent implements OnInit {
  driverLists: any;
  is_checked: any;
  searchText: any;
  page: number = 1;
  pageSize: number = 10;
  baseUrl: string = environment.BASE_URL;
  @ViewChild('excelTable') excelTable!: ElementRef;
  @ViewChild('allList') allList!: ElementRef;
  @ViewChild('selectMenu') selectMenu!: ElementRef;

  fileName = 'Driver List.xlsx';
  isVisible: boolean = false;
  breadCrumbData: any;
  driverLength: any;
  nameFilter: boolean = false;
  phoneFilter: boolean = false;
  driverPhoneText: any = '';
  driverNameText: any = '';
  //Start of Driver Report Variables
  reportForm!: FormGroup;
  @ViewChild('reportModal') reportModal!: ElementRef;
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
            stepSize: 2,
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
  CURRENT_URL: any;
  driverDetails: any;

  //End of Driver Report Variables

  constructor(
    private driverService: DriverService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      // order_by: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.breadCrumbPath();
    this.CURRENT_URL = this.router.url;
    this.getAllDriver();
    this.showSpinner();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  getAllDriver() {
    switch (true) {
      case this.driverNameText !== '':
        this.driverService
          .filterDriverByName(this.driverNameText)
          .subscribe((response: any) => {
            console.log(response);
            this.driverLength = response.data.length;
            this.driverLists = response.data
              .map((result: any, index: any) => {
                return { ...result, sl_no: index + 1 };
              })
              .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize,
              );
          });
        break;
      case this.driverPhoneText !== '':
        this.driverService
          .filterDriverByPhone(this.driverPhoneText)
          .subscribe((response: any) => {
            this.driverLength = response.data.length;
            this.driverLists = response.data
              .map((result: any, index: any) => {
                return { ...result, sl_no: index + 1 };
              })
              .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize,
              );
          });
        break;

      default:
        this.driverService.getAllDrivers().subscribe((response: any) => {
          console.log(response);

          this.driverLength = response.length;
          this.driverLists = response
            .map((result: any, index: any) => {
              return { ...result, sl_no: index + 1 };
            })
            .slice(
              (this.page - 1) * this.pageSize,
              (this.page - 1) * this.pageSize + this.pageSize,
            );
        });
        break;
    }
  }
  findDriverByName(event: any) {
    if (event.target.value.length > 2) {
      this.nameFilter = true;
      this.driverNameText = event.target.value;
      this.getAllDriver();
    } else if (event.target.value === '') {
      this.driverNameText = '';
      this.nameFilter = false;
      this.getAllDriver();
    }
  }
  findDriverByMobile(event: any) {
    if (event.target.value.length > 2) {
      this.driverPhoneText = event.target.value;
      this.phoneFilter = true;
      this.getAllDriver();
    } else if (event.target.value === '') {
      this.driverPhoneText = '';
      this.phoneFilter = false;
      this.getAllDriver();
    }
  }
  onStatusChange(event: any, id: any, is_active: any) {
    console.log(id);
    this.is_checked = is_active;
    console.log('is_Active', is_active);
    console.log('checked', this.is_checked);

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        if (event.target.checked) {
          this.is_checked = 1;
          console.log('is', this.is_checked);
        } else {
          this.is_checked = 0;
          // console.log('ddd', this.is_checked);
        }
        const save_inputs = {
          is_active: this.is_checked,
        };
        console.log(save_inputs);

        if (id !== 0) {
          //add
          // save_inputs.append('id', this.driverId);
          this.driverService
            .updateDriverStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllDriver();
            });
        }
      } else if (result.isDenied) {
        this.getAllDriver();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  onApprovedChange(event: any, id: any, is_approved: any) {
    console.log(id);
    this.is_checked = is_approved;
    console.log('is_Approved', is_approved);
    console.log('checked', this.is_checked);

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        if (event.target.checked) {
          console.log('event>>', event.target.checked);
          this.is_checked = 1;
          console.log('is', this.is_checked);
        } else {
          this.is_checked = 0;
          // console.log('ddd', this.is_checked);
        }
        const save_inputs = new FormData();

        save_inputs.append('is_approved', this.is_checked);
        // console.log(save_inputs);

        if (id !== 0) {
          //add
          // save_inputs.append('id', this.driverId);
          this.driverService
            .updateDrivers(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllDriver();
            });
        }
      } else if (result.isDenied) {
        this.getAllDriver();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  exportExcel(): void {
    this.isVisible = true;

    setTimeout(() => {
      /* pass here the table id */
      let element: HTMLElement = this.excelTable.nativeElement as HTMLElement;

      // let inputElement2: HTMLElement = document.getElementById(
      //   'allList',
      // ) as HTMLElement;
      // inputElement2.click();
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      XLSX.writeFile(wb, this.fileName);

      this.isVisible = false;
    });
  }

  //  For Driver Report

  onReportView(driver: any) {
    this.driverDetails = driver;
    this.intialReports();
  }
  onFilter() {
    // console.log()
    let startDate = this.reportForm.value['start_date'];
    let endDate = this.reportForm.value['end_date'];
    this.getReport(startDate, endDate);
  }
  intialReports() {
    let element: HTMLElement = this.reportModal.nativeElement as HTMLElement;
    element.click();
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
    this.totalRides = [
      {
        data: [],
        label: 'Total Rides',
        backgroundColor: '#01b2c6',
      },
    ];
    this.driverService
      .getDriverRides(this.driverDetails.id, startDate, endDate)
      .subscribe(
        (response: any) => {
          console.log('res', response);

          if (response.data.length > 0) {
            this.message = true;
            this.barChartLabels = [];

            this.totalRides[0].data = response.data.map((d: any) => {
              this.barChartLabels.push(d.Date.split('T')[0]);
              return d.totalRides;
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
  }
  breadCrumbPath() {
    if (this.router.url === '/admin/driver') {
      this.breadCrumbData = {
        heading: 'Driver List',
        routing: [
          {
            routerHeading: 'driver',
            routerLink: '/admin/driver',
          },
        ],
      };
    } else if (this.router.url === '/admin/driver-rides') {
      this.breadCrumbData = {
        heading: 'Driver List',
        routing: [
          {
            routerHeading: 'driver',
            routerLink: '/admin/driver-rides',
          },
        ],
      };
    }
  }
}
