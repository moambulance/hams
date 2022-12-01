import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { DoctorConsultationService } from './doctor-consultation.service';
@Component({
  selector: 'app-doctor-consultation',
  templateUrl: './doctor-consultation.component.html',
  styleUrls: ['./doctor-consultation.component.css'],
})
export class DoctorConsultationComponent implements OnInit {
  doctorConsultationLength: any;
  doctorConsultationList: any;
  searchText: any;
  page: number = 1;
  pageSize: number = 10;
  baseUrl: string = environment.BASE_URL;
  @ViewChild('excelTable') excelTable!: ElementRef;
  // @ViewChild('allList') allList!: ElementRef;

  fileName = 'doctorConsultation List.xlsx';
  isVisible: boolean = false;

  breadCrumbData: any = {
    heading: 'Doctor Consultation',
    routing: [
      {
        routerHeading: 'doctor-consultation',
        routerLink: '/admin/doctor-consultation',
      },
    ],
  };
  constructor(
    private doctorConsultationService: DoctorConsultationService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.showSpinner();
    this.getAllDoctorConsultation();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  getAllDoctorConsultation() {
    this.doctorConsultationService
      .getAllDoctorConsultations()
      .subscribe((response: any) => {
        console.log('response', response);
        this.doctorConsultationLength = response.length;
        this.doctorConsultationList = response
          .map((result: any, index: any) => {
            return { ...result, sl_no: index + 1 };
          })
          .slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
          );
      });
  }
  onApprovedChange(event: any, id: any, is_approved: any) {}
  onStatusChange(event: any, id: any, is_active: any) {}
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
