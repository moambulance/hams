import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonEventsService } from 'src/app/common-events.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AmbulanceService } from './ambulance.service';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.component.html',
  styleUrls: ['./ambulance.component.css'],
})
export class AmbulanceComponent implements OnInit {
  ambulances: any;
  searchText: any;
  ambulanceLength: any;
  pageSize: number = 10;
  is_checked: any;
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
        routerLink: '/hospital/ambulance',
      },
    ],
  };
  userDetails: any;
  constructor(
    private ambulanceService: AmbulanceService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private commonEventService: CommonEventsService,
  ) {}
  baseUrl: string = environment.BASE_URL;
  page: number = 1;
  ngOnInit(): void {
    this.userDetails = this.authService.getRole();
    this.getAllAmbulance();
    this.showSpinner();
  }

  getAllAmbulance() {
    console.log('ambulance');
    this.ambulanceService
      .getAllAmbulanceByHospitalId(this.userDetails?.id)
      .subscribe((response: any) => {
        console.log(response);
        this.ambulanceLength = response.length;
        this.ambulances = response
          .map((result: any, index: any) => {
            return { ...result, sl_no: index + 1 };
          })
          .slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
          );
      });
  }
  // getAmbulanceByRegdNo(event: any): any {
  //   if (event.target.value.length > 2) {
  //     this.ambulanceService
  //       .findByRegdNo(event.target.value)
  //       .subscribe((response: any) => {
  //         this.ambulanceLength = response?.length;
  //         this.ambulances = response
  //           .map((result: any, index: any) => {
  //             return { ...result, sl_no: index + 1 };
  //           })
  //           .slice(
  //             (this.page - 1) * this.pageSize,
  //             (this.page - 1) * this.pageSize + this.pageSize,
  //           );
  //       });
  //   } else if (event.target.value === '') {
  //     this.getAllAmbulance();
  //   }
  // }
  onStatusChange(id: any) {
    console.log(id);

    this.ambulanceService.getAmbulanceById(id).subscribe((response: any) => {
      this.is_checked = response.is_active;
      console.log('issss', this.is_checked);
    });
    // let driverData: any = this.driverForm.value;
    // console.log('<<<<<<', this.driverForm.value);
    // console.log('>>>>', this.dlSrc);
    // console.log('>>>>', this.is_checked);
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        if (this.is_checked === 1) {
          this.is_checked = 0;
        } else {
          this.is_checked = 1;
          console.log('ddd', this.is_checked);
        }
        const save_inputs = new FormData();

        save_inputs.append('is_active', this.is_checked);

        if (id !== 0) {
          //add
          // save_inputs.append('id', this.driverId);
          this.ambulanceService
            .updateAmbulance(id, save_inputs)
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
  // Spinner
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  // Sidebar Toggle
  sidebarToggle!: boolean;
  onToggleClick() {
    if (this.sidebarToggle) {
      this.sidebarToggle = !this.sidebarToggle;
      this.commonEventService.onSidebarToggle(this.sidebarToggle);
    } else {
      this.sidebarToggle = !this.sidebarToggle;
      this.commonEventService.onSidebarToggle(this.sidebarToggle);
    }
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
