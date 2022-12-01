import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';

import { AddDriverComponent } from './driver/add-driver/add-driver.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverComponent } from './driver/driver.component';
import { DriverDetailsComponent } from './driver/driver-details/driver-details.component';
import { AmbulanceComponent } from './ambulance/ambulance.component';
import { BookAnAmbulanceComponent } from './ambulance/book-an-ambulance/book-an-ambulance.component';
import { AmbulanceDetailsComponent } from './ambulance/ambulance-details/ambulance-details.component';
import { AddAmbulanceDetailsComponent } from './ambulance/add-ambulance-details/add-ambulance-details.component';
import { LiveAmbulanceComponent } from './ambulance/live-ambulance/live-ambulance.component';
import { HelpComponent } from './help/help.component';
import { TotalRidesComponent } from './reports/total-rides/total-rides.component';
import { AmbulanceRevenueComponent } from './reports/ambulance-revenue/ambulance-revenue.component';
import { AmbulanceTypeComponent } from './reports/ambulance-type/ambulance-type.component';
import { PatientConditionComponent } from './reports/patient-condition/patient-condition.component';
import { PatientLocationComponent } from './reports/patient-location/patient-location.component';
import { PatientTypeComponent } from './reports/patient-type/patient-type.component';
import { TimeTakenComponent } from './reports/time-taken/time-taken.component';
import { MoAmbulancePatientComponent } from './reports/mo-ambulance-patient/mo-ambulance-patient.component';
import { ManagePricesComponent } from './manage-prices/manage-prices.component';
import { ManageBedsComponent } from './manage-beds/manage-beds.component';
import { OrdersComponent } from './orders/orders.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { HasRoleGuard } from 'src/app/guard/has-role.guard';
import { PatientDetailsComponent } from '../admin/patients/patient-details/patient-details.component';

const routes: Routes = [
  {
    path: 'hospital',
    redirectTo: 'hospital/dashboard',
    pathMatch: 'full',

  },
  {
    path: 'kiosks',
    redirectTo: 'hospital/kiosks',
    pathMatch: 'full',
    data: { type: 'hospital', role: 3, },
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'kiosks',
    component: KioskComponent,
    canActivate: [AuthGuard, HasRoleGuard],
    data: { type: 'hospital', role: 3 },
  },
  {
    path: 'ambulance',
    component: AmbulanceComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'ambulance-booking',
    component: BookAnAmbulanceComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'live-ambulance',
    component: LiveAmbulanceComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'ambulance/ambulance-details/:id',
    component: AmbulanceDetailsComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'ambulance/add-ambulance',
    component: AddAmbulanceDetailsComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'ambulance/edit-ambulance/:id',
    component: AddAmbulanceDetailsComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'driver',
    component: DriverComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'driver/driver-details/:id',
    component: DriverDetailsComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'driver/add-driver',
    component: AddDriverComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'driver/edit-driver/:id',
    component: AddDriverComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'reports/total-rides',
    component: TotalRidesComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'reports/total-rides',
    component: TotalRidesComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'reports/ambulance-revenue',
    component: AmbulanceRevenueComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'reports/ambulance-type',
    component: AmbulanceTypeComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'reports/patient-type',
    component: PatientTypeComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'reports/patient-condition',
    component: PatientConditionComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },

  {
    path: 'reports/patient-location',
    component: PatientLocationComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'reports/time-taken',
    component: TimeTakenComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'reports/moAmbulance-patient',
    component: MoAmbulancePatientComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },

  {
    path: 'help',
    component: HelpComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'manage-prices',
    component: ManagePricesComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'manage-beds',
    component: ManageBedsComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard, HasRoleGuard],

  },
  {
    path: 'patients/patientDetails/:id',
    component: PatientDetailsComponent,
    canActivate: [AuthGuard, HasRoleGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalRoutingModule { }
