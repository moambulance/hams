import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerService } from './customer.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customerList: any;
  searchText: any;
  baseUrl: any = environment.BASE_URL;
  page: number = 1;
  pageSize: number = 10;
  customerLength: any;
  // start variables Excel sheet Conversion
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Customer List.xlsx';
  isVisible: boolean = false;
  //end Excel sheet Conversion
  breadCrumbData: any = {
    heading: 'Customer List',
    routing: [
      {
        routerHeading: 'customer-list',
        routerLink: '/admin/customer-list',
      },
    ],
  };
  allCustomers: any;
  constructor(
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.showSpinner();
    this.getCustomer();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  getCustomer() {
    this.customerService.getCustomer().subscribe((response: any) => {
      console.log('<><><><>', response);

      this.customerLength = response.length;
      this.allCustomers = response;
      this.customerList = response
        .map((result: any, index: any) => {
          if (result.search_time != null) {
            result.search_time = new Date(Number(result.search_time))
              .toString()
              .split('G')[0];
          }
          return { ...result, sl_no: index + 1 };
        })
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize,
        );
    });
  }
  exportExcel(): void {
    this.customerList = this.allCustomers;
    this.isVisible = true;
    setTimeout(() => {
      this.getCustomer();
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
