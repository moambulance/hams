import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { OrdersService } from './orders.service';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any;
  pageSize: number = 10;
  page: number = 1;
  ordersLength: any;
  is_checked: any;
  approved: any;
  baseUrl: string = environment.BASE_URL;
  // toggle variable
  hamburgerClass: any = 'hamburger';
  sidebarClass: any = 'show';
  searchText: any;
  fileName = 'Orders List.xlsx';
  isVisible: boolean = false;
  @ViewChild('excelTable') excelTable!: ElementRef;
  @ViewChild('endTripId') endTripId!: ElementRef;
  orderType: any = 'DESC';
  breadCrumbData: any = {
    heading: 'Order List',
    routing: [
      {
        routerHeading: 'Order List',
        routerLink: '/admin/orders',
      },
    ],
  };
  onTripOrderData: any;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
    this.hospitalId = this.authService.getRole().id;
    console.log('hos Id', this.hospitalId);

    this.showSpinner();
    this.getAllOrders();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }

  getAllOrders() {
    this.ordersService
      .getOrdersByHospitalId(this.hospitalId, this.orderType)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.ordersLength = response.length;

          console.log('response', response);
          // For pagination and orders details
          this.orders = response
            ?.map((result: any, index: any) => {
              return { ...result, sl_no: index + 1 };
            })
            .slice(
              (this.page - 1) * this.pageSize,
              (this.page - 1) * this.pageSize + this.pageSize,
            );
        },
        (error: any) => {
          console.log('error', error);
        },
      );
  }
  hospitalId(hospitalId: any, orderType: any) {
    throw new Error('Method not implemented.');
  }
  // On update Approved hospital
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
  onTripData(order: any) {
    this.onTripOrderData = order;
    let element: HTMLElement = this.endTripId.nativeElement as HTMLElement;
    element.click();
  }
  onEndTrip() {
    let id: any = this.onTripOrderData.id;
    let data: any = {
      live_lat: this.onTripOrderData.live_lat,
      live_lon: this.onTripOrderData.live_lon,
      status: 1,
      payment_method: this.onTripOrderData.payment_method
        ? this.onTripOrderData.payment_status
        : '',
      payment_status: this.onTripOrderData.payment_status
        ? this.onTripOrderData.payment_status
        : '',
      destination: this.onTripOrderData.destination
        ? this.onTripOrderData.destination
        : '',
    };

    this.ordersService.closeTrip(id, data).subscribe((response: any) => {
      if (response.success) {
        console.log('response', response);
        this.getAllOrders();
        this.toaster.success(response.message);
      } else {
        this.toaster.error(response.messages);
      }
    });
  }
  onOrderDisplayType() {
    console.log('Before', this.orderType);

    this.orderType === 'DESC'
      ? (this.orderType = 'ASC')
      : (this.orderType = 'DESC');
    console.log('After', this.orderType);
    this.getAllOrders();
  }
  // For Invoice Generation
  onInvoiceGenerate(order: any) {
    this.spinner.show();
    this.ordersService.generateInvoiceByOrderId(order.id).subscribe(
      (response: any) => {
        if (response.success) {
          this.toaster.success('Invoice Generated Successfully');
          const invoicePath = response.data.path;
          this.spinner.hide();
          window.open(this.baseUrl + invoicePath, '_blank');
        } else {
          this.toaster.error(response.message);
          this.spinner.hide();
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.toaster.error('Something went wrong, please contact support');
      },
    );
  }
}
