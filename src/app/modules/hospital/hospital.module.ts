import { MaterialModules } from './../../material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HospitalRoutingModule } from './hospital-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ReportsComponent } from './reports/reports.component';
import { SharedModule } from '../../shared/shared.module';
import { DriverComponent } from './driver/driver.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddDriverComponent } from './driver/add-driver/add-driver.component';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmbulanceComponent } from './ambulance/ambulance.component';
import { DriverDetailsComponent } from './driver/driver-details/driver-details.component';
import { BookAnAmbulanceComponent } from './ambulance/book-an-ambulance/book-an-ambulance.component';
import { LiveAmbulanceComponent } from './ambulance/live-ambulance/live-ambulance.component';
import { IotComponent } from './iot/iot.component';
import { AddAmbulanceDetailsComponent } from './ambulance/add-ambulance-details/add-ambulance-details.component';
import { AmbulanceDetailsComponent } from './ambulance/ambulance-details/ambulance-details.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { ChartsModule } from 'ng2-charts';
// import * as chart from 'chart.js';
import * as Chart from 'chart.js';
import { ToastrModule } from 'ngx-toastr';
import { HelpComponent } from './help/help.component';
import { TotalRidesComponent } from './reports/total-rides/total-rides.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AmbulanceTypeComponent } from './reports/ambulance-type/ambulance-type.component';
import { PatientTypeComponent } from './reports/patient-type/patient-type.component';
import { TimeTakenComponent } from './reports/time-taken/time-taken.component';
import { PatientConditionComponent } from './reports/patient-condition/patient-condition.component';
import { AmbulanceRevenueComponent } from './reports/ambulance-revenue/ambulance-revenue.component';
import { PatientLocationComponent } from './reports/patient-location/patient-location.component';
import { MoAmbulancePatientComponent } from './reports/mo-ambulance-patient/mo-ambulance-patient.component';
import { ManagePricesComponent } from './manage-prices/manage-prices.component';
import { ManageBedsComponent } from './manage-beds/manage-beds.component';
import { SearchFilterPipe } from './pipe/search-filter.pipe';
import { OrdersComponent } from './orders/orders.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { LiveKiosksComponent } from './kiosk/live-kiosks/live-kiosks.component';
import { InvoiceComponent } from './kiosk/invoice/invoice.component';
import { MhuComponent } from './mhu/mhu.component';
import { MvitalsDashboardComponent } from './mvitals-dashboard/mvitals-dashboard.component';
import { MhuDashboardComponent } from './mhu-dashboard/mhu-dashboard.component';

// import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent,
    LiveAmbulanceComponent,
    BookAnAmbulanceComponent,
    IotComponent,
    ReportsComponent,
    DriverComponent,
    AddDriverComponent,
    DriverDetailsComponent,
    AmbulanceComponent,
    AmbulanceDetailsComponent,
    AddAmbulanceDetailsComponent,
    HelpComponent,
    TotalRidesComponent,
    ChangePasswordComponent,
    AmbulanceTypeComponent,
    PatientTypeComponent,
    TimeTakenComponent,
    PatientConditionComponent,
    AmbulanceRevenueComponent,
    PatientLocationComponent,
    MoAmbulancePatientComponent,
    ManagePricesComponent,
    ManageBedsComponent,
    SearchFilterPipe,
    OrdersComponent,
    KioskComponent,
    LiveKiosksComponent,
    InvoiceComponent,
    MhuComponent,
    MvitalsDashboardComponent,
    MhuDashboardComponent
  ],
  imports: [
    CommonModule,
    HospitalRoutingModule,
    SharedModule,
    NgxDatatableModule,
    NgxPaginationModule,
    DataTablesModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AgmCoreModule,
    AgmDirectionModule,
    ChartsModule,
    NgbToastModule,
    ToastrModule.forRoot(),
    MaterialModules,
    // Chart
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HospitalModule {}
