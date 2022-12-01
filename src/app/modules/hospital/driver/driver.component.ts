import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DriverService } from './driver.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponent implements OnInit {
  drivers: any;
  searchText: any;
  pageSize: number = 10;
  driversLength: any;
  is_checked: any;
  userDetails: any;
  baseUrl: string = environment.BASE_URL;
  page: number = 1;
  // start variables Excel sheet Conversion
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Driver List.xlsx';
  isVisible: boolean = false;
  //end Excel sheet Conversion

  breadCrumbData: any = {
    heading: 'Driver List',
    routing: [
      {
        routerHeading: 'driver-list',
        routerLink: '/hospital/driver',
      },
    ],
  };
  nameFilter: boolean = false;
  phoneFilter: boolean = false;
  constructor(
    private driverService: DriverService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    // this.drivers.paginator = this.paginator;

    this.userDetails = this.authService.getRole();

    this.getAllDrivers();
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
  getAllDrivers() {
    this.driverService
      .getAllDriversByHospitalId(this.userDetails?.id)
      .subscribe((response: any) => {
        console.log('<<>><<>>', response);
        this.driversLength = response?.data?.length;
        console.log('response', response);
        this.drivers = response?.data
          ?.map((result: any, index: any) => {
            return { ...result, sl_no: index + 1 };
          })
          .slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
          );
      });
  }
  findDriverByName(event: any) {
    if (event.target.value.length > 2) {
      this.nameFilter = true;
      this.driverService
        .filterDriverByName(event.target.value)
        .subscribe((response: any) => {
          console.log(response);

          this.drivers = response.data
            .map((result: any, index: any) => {
              return { ...result, sl_no: index + 1 };
            })
            .slice(
              (this.page - 1) * this.pageSize,
              (this.page - 1) * this.pageSize + this.pageSize,
            );
        });
    } else if (event.target.value === '') {
      this.nameFilter = false;
      this.getAllDrivers();
    }
  }
  findDriverByMobile(event: any) {
    if (event.target.value.length > 2) {
      this.phoneFilter = true;
      this.driverService
        .filterDriverByPhone(event.target.value)
        .subscribe((response: any) => {
          console.log(response);

          this.drivers = response.data
            .map((result: any, index: any) => {
              return { ...result, sl_no: index + 1 };
            })
            .slice(
              (this.page - 1) * this.pageSize,
              (this.page - 1) * this.pageSize + this.pageSize,
            );
        });
    } else if (event.target.value === '') {
      this.phoneFilter = false;
      this.getAllDrivers();
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
        const save_inputs = new FormData();

        save_inputs.append('is_active', this.is_checked);
        console.log(save_inputs);

        if (id !== 0) {
          //add
          // save_inputs.append('id', this.driverId);
          this.driverService
            .updateDrivers(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllDrivers();
            });
        }
      } else if (result.isDenied) {
        this.getAllDrivers();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  exportExcel(): void {
    this.isVisible = true;
    this.pageSize = this.driversLength;
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
