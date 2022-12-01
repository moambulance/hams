import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PatientService } from './patient.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent implements OnInit {
  patients: any;
  pageSize: number = 10;
  patientsLength: any;
  is_checked: any;
  approved: any;
  baseUrl: string = environment.BASE_URL;
  page: number = 1;
  // toggle variable
  hamburgerClass: any = 'hamburger';
  sidebarClass: any = 'show';
  searchText: any;
  // start variables Excel sheet Conversion
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Patient List.xlsx';
  isVisible: boolean = false;
  //end Excel sheet Conversion

  breadCrumbData: any = {
    heading: 'Patient List',
    routing: [
      {
        routerHeading: 'Patient',
        routerLink: '/admin/patients',
      },
    ],
  };
  constructor(
    private patientService: PatientService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit() {
    this.showSpinner();
    this.getAllPatients();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  getAllPatients() {
    this.patientService.getAllPatients().subscribe((response: any) => {
      console.log(response);
      this.patientsLength = response.length;

      // console.log('response', response);

      this.patients = response
        .map((result: any, index: any) => {
          return { ...result, sl_no: index + 1 };
        })
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize,
        );
    });
  }

  // on update patients status
  // onStatusChange(e: any, id: any, is_active: any) {
  //   this.is_checked = is_active;
  //   // console.log(e.target.checked);
  //   // console.log('>>', this.is_checked);

  //   // console.log(id);

  //   Swal.fire({
  //     title: 'Do you want to save the changes?',
  //     showDenyButton: true,
  //     showCancelButton: false,
  //     confirmButtonText: `Save`,
  //     denyButtonText: `Cancel`,
  //   }).then((result: any) => {
  //     /* Read more about isConfirmed, isDenied below */

  //     if (result.isConfirmed) {
  //       if (e.target.checked) {
  //         console.log('>>', this.is_checked);
  //         this.is_checked = 1;
  //       } else {
  //         this.is_checked = 0;
  //       }
  //       const save_inputs = {
  //         is_active: this.is_checked,
  //       };

  //       if (id !== 0) {
  //         this.patientService
  //           .updatePatientstatus(id, save_inputs)
  //           .subscribe((response: any) => {
  //             console.log('tttt', response);
  //             this.getAllpatients();
  //             Swal.fire('Saved!', '', 'success');
  //           });
  //       }
  //     } else if (result.isDenied) {
  //       this.getAllPatients();
  //       Swal.fire('Changes are not saved', '', 'info');
  //     }
  //   });
  // }

  // On update Approved patients
  // onApproved(event: any, id: any, is_approved: any) {
  //   console.log(id);
  //   this.approved = is_approved;
  //   console.log('approved: ', this.approved);
  //   console.log('is_approved: ', is_approved);
  //   Swal.fire({
  //     title: 'Do you want to save the changes?',
  //     showDenyButton: true,
  //     showCancelButton: false,
  //     confirmButtonText: `Save`,
  //     denyButtonText: `Cancel`,
  //   }).then((result) => {
  //     /* Read more about isConfirmed, isDenied below */

  //     if (result.isConfirmed) {
  //       if (event.target.value) {
  //         this.approved = 1;
  //       } else {
  //         this.approved = 0;
  //       }
  //       console.log('ddd', this.approved);

  //       const save_inputs = {
  //         is_approved: this.approved,
  //       };

  //       if (id !== 0) {
  //         this.patientService
  //           .updateApprovepatients(id, save_inputs)
  //           .subscribe((response: any) => {
  //             console.log('tttt', response);
  //             this.getAllpatients();
  //             Swal.fire('Saved!', '', 'success');
  //           });
  //       }
  //     } else if (result.isDenied) {
  //       this.getAllpatients();
  //       Swal.fire('Changes are not saved', '', 'info');
  //     }
  //   });
  // }
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
