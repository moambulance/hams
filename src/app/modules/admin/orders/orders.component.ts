import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { OrdersService } from './orders.service';
import * as XLSX from 'xlsx';

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
  searchText: any = '';
  fileName = 'Orders List.xlsx';
  isVisible: boolean = false;
  @ViewChild('excelTable') excelTable!: ElementRef;
  @ViewChild('excelDriverTable') excelDriverTable!: ElementRef;
  @ViewChild('endTripId') endTripId!: ElementRef;
  @ViewChild('driverOrdersModal') driverOrdersModal!: ElementRef;
  orderType: any = 'DESC';
  isAmbulance: boolean = false;
  isDriverName: boolean = false;
  isDriverPhone: boolean = false;
  ambulanceText: any = '';
  driverNameText: any = '';
  driverPhoneText: any = '';
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
  totalOrders: any;
  driverOrderData: any;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
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
    switch (true) {
      case this.isAmbulance:
        this.ordersService.findOrdersByAmbulance(this.ambulanceText).subscribe(
          (response: any) => {
            if (response.data === null) {
              this.totalOrders = 0;
              this.orders = [];

              return;

              // this.toaster.warning('No data Found');
            }

            this.ordersLength = response.length;
            // For pagination and orders details
            this.totalOrders = response;
            this.orders = response
              .map((result: any, index: any) => {
                return { ...result, sl_no: index + 1 };
              })
              .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize,
              );
          },
          (error: any) => {
            this.toaster.error(error.error.message);
          },
        );
        break;
      case this.isDriverName:
        this.ordersService
          .findOrdersByDriverName(this.driverNameText)
          .subscribe(
            (response: any) => {
              if (response.data === null) {
                this.totalOrders = 0;
                this.orders = [];

                return;

                // this.toaster.warning('No data Found');
              }

              this.ordersLength = response.length;
              // For pagination and orders details
              this.totalOrders = response;

              this.orders = response
                .map((result: any, index: any) => {
                  return { ...result, sl_no: index + 1 };
                })
                .slice(
                  (this.page - 1) * this.pageSize,
                  (this.page - 1) * this.pageSize + this.pageSize,
                );
            },
            (error: any) => {
              this.toaster.error(error.error.message);
            },
          );
        break;
      case this.isDriverPhone:
        this.ordersService
          .findOrdersByDriverNumber(this.driverPhoneText)
          .subscribe(
            (response: any) => {
              if (response.data === null) {
                this.totalOrders = 0;
                this.orders = [];
                this.spinner.hide();
                return;

                // this.toaster.warning('No data Found');
              }

              this.ordersLength = response.length;
              // For pagination and orders details
              this.spinner.hide();
              this.totalOrders = response;
              this.orders = response
                .map((result: any, index: any) => {
                  return { ...result, sl_no: index + 1 };
                })
                .slice(
                  (this.page - 1) * this.pageSize,
                  (this.page - 1) * this.pageSize + this.pageSize,
                );
              this.spinner.hide();
            },

            (error: any) => {
              this.spinner.hide();
              this.toaster.error(error.error.message);
            },
          );
        break;

      default:
        this.ordersService.getAllExistingOrders(this.orderType).subscribe(
          (response: any) => {
            console.log(response);
            if (response.data === null) {
              this.totalOrders = 0;
              this.orders = [];
              this.spinner.hide();
              return;
              // this.toaster.warning('No data Found');
            }
            this.ordersLength = response.length;

            console.log('response', response);
            // For pagination and orders details
            this.spinner.hide();
            this.totalOrders = response;
            this.orders = response
              .map((result: any, index: any) => {
                return { ...result, sl_no: index + 1 };
              })
              .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize,
              );
            this.spinner.hide();
          },
          (error: any) => {
            console.log('error', error);

            this.toaster.error(error.error.message);
            this.spinner.hide();
          },
        );
        break;
    }
  }
  findOrdersByAmbulance(event: any) {
    if (event.target.value.length > 3) {
      this.isAmbulance = true;
      this.ambulanceText = event.target.value;
      this.getAllOrders();
    } else if (event.target.value === '') {
      this.isAmbulance = false;
      this.ambulanceText = '';
      this.getAllOrders();
    }
  }
  findOrdersByDriverName(event: any) {
    if (event.target.value.length > 2) {
      this.isDriverName = true;
      this.driverNameText = event.target.value;
      this.getAllOrders();
    } else if (event.target.value === '') {
      this.isDriverName = false;

      this.getAllOrders();
    }
  }
  findOrdersByDriverNumber(event: any) {
    if (event.target.value.length > 3) {
      this.isDriverPhone = true;
      this.driverPhoneText = event.target.value;
      this.getAllOrders();
    } else if (event.target.value === '') {
      this.isDriverPhone = false;
      this.getAllOrders();
      this.driverPhoneText = '';
    }
  }
  // On update Approved hospital
  exportExcel(): void {
    this.orders = this.totalOrders;
    this.isVisible = true;

    // this.page = 1;
    setTimeout(() => {
      this.getAllOrders();
      /* pass here the table id */
      let element: HTMLElement = this.excelTable.nativeElement as HTMLElement;
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      XLSX.writeFile(wb, this.fileName);
      this.pageSize = 10;
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
  onDriverOrderDetails(order: any) {
    console.log('orderDorderata', order.driver_id.id);

    this.ordersService.getDriverOrderDetails(order.driver_id.id).subscribe(
      (orderData: any) => {
        console.log('orderData', orderData.data);
        this.driverOrderData = orderData.data;
        this.driverOrdersModal.nativeElement.click();
      },
      (error: any) => {
        console.log('error', error);

        this.toaster.error(error.error.message);
      },
    );
  }
  exportDriverExcel(): void {
    this.orders = this.totalOrders;
    this.isVisible = true;

    // this.page = 1;
    setTimeout(() => {
      /* pass here the table id */
      let element: HTMLElement = this.excelDriverTable
        .nativeElement as HTMLElement;
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      XLSX.writeFile(wb, this.fileName);
      this.pageSize = 10;
      this.isVisible = false;
    });
  }
}
