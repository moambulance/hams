import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AmbulanceService } from './ambulance.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { DriverService } from '../driver/driver.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.component.html',
  styleUrls: ['./ambulance.component.css'],
})
export class AmbulanceComponent implements OnInit {
  ambulances: any;
  ambulanceLength: any;
  is_checked: any;
  searchText: any;
  @ViewChild('openModal') openModal!: ElementRef;
  ambulance_id: number = 0;
  baseUrl: string = environment.BASE_URL;
  page: number = 1;
  pageSize: number = 10;
  // start variables Excel sheet Conversion
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Ambulance List.xlsx';
  isVisible: boolean = false;
  //end Excel sheet Conversion
  breadCrumbData: any = {
    heading: 'Ambulance List',
    routing: [
      {
        routerHeading: 'ambulance-list',
        routerLink: '/admin/ambulance-list',
      },
    ],
  };
  allAvailableDrivers: any;
  selectedDrv: any = [];
  ambulanceText: any = '';
  ambulanceDetails: any;
  //Start of Ambulance Report Variables
  reportForm!: FormGroup;

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
  @ViewChild('reportModal') reportModal!: ElementRef;

  //End of Ambulance Report Variables
  constructor(
    private ambulanceService: AmbulanceService,
    private spinner: NgxSpinnerService,
    private driverService: DriverService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      // order_by: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    this.CURRENT_URL = this.router.url;
    this.getAllAmbulance();
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

  getAllAmbulance(): any {
    switch (true) {
      case this.ambulanceText !== '':
        this.ambulanceService
          .findByRegdNo(this.ambulanceText)
          .subscribe((response: any) => {
            this.ambulanceLength = response?.length;
            this.ambulances = response
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
        this.ambulanceService.getAmbulance().subscribe((response: any) => {
          this.ambulanceLength = response?.length;
          this.ambulances = response
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
  getAmbulanceByRegdNo(event: any): any {
    if (event.target.value.length > 2) {
      this.ambulanceText = event.target.value;
      this.getAllAmbulance();
    } else if (event.target.value === '') {
      this.ambulanceText = '';
      this.getAllAmbulance();
    }
  }
  onStatusChange(id: any) {
    // console.log(id);s

    this.ambulanceService.getAmbulanceById(id).subscribe((response: any) => {
      this.is_checked = response.is_active;
      console.log('issss', this.is_checked);
    });
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.is_checked === 1) {
          this.is_checked = 0;
        } else {
          this.is_checked = 1;
          console.log('ddd', this.is_checked);
        }
        const save_inputs = {
          is_active: this.is_checked,
        };

        if (id !== 0) {
          this.ambulanceService
            .updateAmbulanceStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              this.getAllAmbulance();
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        this.getAllAmbulance();
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
        const save_inputs: any = { is_approved: this.is_checked };

        if (id !== 0) {
          //add
          // save_inputs.append('id', this.ambulanceId);
          this.ambulanceService
            .updateAmbulanceApprove(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllAmbulance();
            });
        }
      } else if (result.isDenied) {
        this.getAllAmbulance();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
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
  getDrivers(id: any) {
    this.ambulance_id = id;
    this.driverService.getActiveApprovedDrivers().subscribe((driver: any) => {
      // Get All Active Approved driver By Hospital
      this.allAvailableDrivers = driver.map((aData: any) => {
        let aId = aData.ambulance_id ? aData.ambulance_id : '';
        console.log(aData);

        if (parseInt(aId) === this.ambulance_id) {
          this.selecedDriver(aData);

          return {
            ...aData,
            selected: true,
          };
        } else {
          return {
            ...aData,
            selected: false,
          };
        }
      });
    });

    this.openModal.nativeElement.click();
  }
  selecedDriver(driver: any): any {
    driver.selected = !driver.selected;
    let aId = driver.ambulance_id ? driver.ambulance_id : 0;
    if (driver.selected) {
      let addElement: any = {
        id: driver.id,
        ambulance_id: this.ambulance_id,
      };
      this.filterdriverArray(this.selectedDrv, addElement);
      this.selectedDrv.push(addElement);
    } else {
      let removeElement = { id: driver.id, ambulance_id: this.ambulance_id };
      this.filterdriverArray(this.selectedDrv, removeElement);
      if (parseInt(aId)) {
        this.selectedDrv.push({
          id: driver.id,
          ambulance_id: 0,
        });
      }
    }
  }
  filterdriverArray(array: any, element: any) {
    this.selectedDrv = [];
    array.filter((el: any) => {
      if (el.id !== element.id) {
        this.selectedDrv.push(el);
      }
    });
  }
  updateAssignedAmbulance() {
    this.showSpinner();
    this.toaster.success('driver assign updated successfully!!!');
    this.driverService
      .updateAssignedAmbulance(this.selectedDrv)
      .subscribe((response: any) => {
        this.ambulance_id = 0;
      });
  }

  //  For Ambulance Report

  onReportView(ambulance: any) {
    this.ambulanceDetails = ambulance;
    this.intialReports();
  }
  onFilter() {
    // console.log()
    let startDate = this.reportForm.value['start_date'];
    let endDate = this.reportForm.value['end_date'];
    this.getReport(startDate, endDate);
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
    let element: HTMLElement = this.reportModal.nativeElement as HTMLElement;
    element.click();
  }
  getReport(startDate: any, endDate: any) {
    this.totalRides = [
      {
        data: [],
        label: 'Total Rides',
        backgroundColor: '#01b2c6',
      },
    ];
    this.ambulanceService
      .getAmbulanceRides(this.ambulanceDetails.id, startDate, endDate)
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
}
