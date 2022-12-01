import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { MedicineDeliveryService } from './medicine-delivery.service';

@Component({
  selector: 'app-medicine-delivery',
  templateUrl: './medicine-delivery.component.html',
  styleUrls: ['./medicine-delivery.component.css'],
})
export class MedicineDeliveryComponent implements OnInit {
  medicineDeliveryLength: any;
  medicineDeliveryList: any;
  searchText: any;
  page: number = 1;
  pageSize: number = 10;
  baseUrl: string = environment.BASE_URL;
  @ViewChild('excelTable') excelTable!: ElementRef;
  // @ViewChild('allList') allList!: ElementRef;

  fileName = 'Medicine List.xlsx';
  isVisible: boolean = false;

  breadCrumbData: any = {
    heading: 'Delivery List',
    routing: [
      {
        routerHeading: 'medicine-delivery',
        routerLink: '/admin/medicines-delivery',
      },
    ],
  };
  constructor(
    private medicineDeliveryService: MedicineDeliveryService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.showSpinner();
    this.getAllMedicineDelivery();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  getAllMedicineDelivery() {
    this.medicineDeliveryService
      .getAllMedicineDelivery()
      .subscribe((response: any) => {
        console.log('response', response);
        this.medicineDeliveryLength = response.length;
        this.medicineDeliveryList = response
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
