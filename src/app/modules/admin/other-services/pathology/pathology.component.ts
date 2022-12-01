import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { PathologyService } from './pathology.service';

@Component({
  selector: 'app-pathology',
  templateUrl: './pathology.component.html',
  styleUrls: ['./pathology.component.css'],
})
export class PathologyComponent implements OnInit {
  pathologyLength: any;
  pathologyList: any;
  searchText: any;
  page: number = 1;
  pageSize: number = 10;
  baseUrl: string = environment.BASE_URL;
  @ViewChild('excelTable') excelTable!: ElementRef;
  // @ViewChild('allList') allList!: ElementRef;

  fileName = 'pathology List.xlsx';
  isVisible: boolean = false;

  breadCrumbData: any = {
    heading: 'Pathology',
    routing: [
      {
        routerHeading: 'pathology',
        routerLink: '/admin/pathology',
      },
    ],
  };
  constructor(
    private pathologyService: PathologyService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.showSpinner();
    this.getAllPathology();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  getAllPathology() {
    this.pathologyService.getAllPathology().subscribe((response: any) => {
      console.log('response', response);
      this.pathologyLength = response.length;
      this.pathologyList = response
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
