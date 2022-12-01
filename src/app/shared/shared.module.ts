import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
// import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ToastsContainer } from '../components/toasts/toasts-container.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { PatientVitalsComponent } from '../components/patient-vitals/patient-vitals.component';
import { JanitriVitalsComponent } from '../components/janitri-vitals/janitri-vitals.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SideNavComponent } from '../components/side-nav/side-nav.component';
@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    BreadcrumbComponent,
    ToastsContainer,
    SpinnerComponent,
    PatientVitalsComponent,
    JanitriVitalsComponent,
    FooterComponent,
    SideNavComponent
  ],

  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    NgxSpinnerModule,
    NgbToastModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    BreadcrumbComponent,
    ToastsContainer,
    SpinnerComponent,
    PatientVitalsComponent,
    JanitriVitalsComponent,
    SideNavComponent
  ],
})
export class SharedModule {}
