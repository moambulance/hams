import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { RouterModule } from '@angular/router';
import { AdminBreadcrumbComponent } from './admin-breadcrumb/admin-breadcrumb.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminSpinnerComponent } from './admin-spinner/admin-spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BarchartComponent } from './chart/barchart/barchart.component';
import { PiechartComponent } from './chart/piechart/piechart.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AdminNavbarComponent,
    AdminSidebarComponent,
    AdminFooterComponent,
    AdminBreadcrumbComponent,
    AdminSpinnerComponent,
    AdminSpinnerComponent,
    BarchartComponent,
    PiechartComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxSpinnerModule,
    ChartsModule,
  ],
  exports: [
    AdminNavbarComponent,
    AdminSidebarComponent,
    AdminFooterComponent,
    AdminBreadcrumbComponent,
    AdminSpinnerComponent,
    BarchartComponent,
    PiechartComponent,
  ],
})
export class AdminSharedModule {}
