import { PatientDetailsComponent } from './patients/patient-details/patient-details.component';
import { HospitalToHospitalComponent } from './reports/hospital-to-hospital/hospital-to-hospital.component';
import { HospitalHeReportComponent } from './reports/hospital-he-report/hospital-he-report.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/guard/admin.guard';
import { HasRoleGuard } from 'src/app/guard/has-role.guard';
// import { DriverComponent } from '../hospital/driver/driver.component';
import { AddAmbulanceTypeComponent } from './ambulance/add-ambulance-type/add-ambulance-type.component';
import { AddAdvertiseComponent } from './advertise/add-advertise/add-advertise.component';
import { AdvertiseComponent } from './advertise/advertise.component';

import { AddAmbulanceComponent } from './ambulance/add-ambulance/add-ambulance.component';
import { AmbulanceDetailsComponent } from './ambulance/ambulance-details/ambulance-details.component';
import { AmbulanceComponent } from './ambulance/ambulance.component';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverComponent } from './driver/driver.component';
import { HospitalAvailableServicesComponent } from './hospital-available-services/hospital-available-services.component';
import { HospitalDepartmentComponent } from './hospital-department/hospital-department.component';
import { HospitalHeTypesComponent } from './hospital-he-types/hospital-he-types.component';
import { AddHospitalComponent } from './hospitals/add-hospital/add-hospital.component';
import { HospitalDetailsComponent } from './hospitals/hospital-details/hospital-details.component';
import { HospitalUserComponent } from './hospitals/hospital-user/hospital-user.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { OrdersComponent } from './orders/orders.component';
import { PatientsComponent } from './patients/patients.component';
import { SufferingFromComponent } from './suffering-from/suffering-from.component';
import { AmbulanceTypeComponent } from './ambulance/ambulance-type/ambulance-type.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MedicinesComponent } from './master/medicines/medicines.component';
import { AddMedicinesComponent } from './master/medicines/add-medicines/add-medicines.component';
import { MedicineDeliveryComponent } from './other-services/medicine-delivery/medicine-delivery.component';
import { AddMedicineDeliveryComponent } from './other-services/medicine-delivery/add-medicine-delivery/add-medicine-delivery.component';
import { LiveAmbulanceComponent } from './ambulance/live-ambulance/live-ambulance.component';
import { HomecareComponent } from './other-services/homecare/homecare.component';
import { AddHomecareComponent } from './other-services/homecare/add-homecare/add-homecare.component';
import { PathologyComponent } from './other-services/pathology/pathology.component';
import { AddPathologyComponent } from './other-services/pathology/add-pathology/add-pathology.component';

import { AddDoctorConsultationComponent } from './other-services/doctor-consultaton/add-doctor-consultation/add-doctor-consultation.component';
import { TestTypeComponent } from './master/test-type/test-type.component';
import { ServiceTypeComponent } from './master/service-type/service-type.component';
import { SpecialistTypeComponent } from './master/specialist-type/specialist-type.component';
import { DoctorConsultationComponent } from './other-services/doctor-consultaton/doctor-consultation.component';
import { AddDriverComponent } from './driver/add-driver/add-driver.component';
import { AddOrderComponent } from './orders/add-order/add-order.component';
import { OnBoardedComponent } from './on-boarded/on-boarded.component';
import { BookAnAmbulanceComponent } from './ambulance/book-an-ambulance/book-an-ambulance.component';
import { OnboardedHospitalComponent } from './hospitals/onboarded-hospital/onboarded-hospital.component';
import { ReportsComponent } from './reports/reports.component';
import { AmbulanceReportComponent } from './reports/ambulance/ambulance-report.component';
import { TotalRidesComponent } from './reports/total-rides/total-rides.component';
import { KiosksComponent } from './hospitals/kiosks/kiosks.component';
import { IotComponent } from './iot/iot.component';
import { IotCompaniesComponent } from './iot/iot-companies/iot-companies.component';
import { SettingsComponent } from './settings/settings.component';
import { MvitalsUserComponent } from './master/mvitals-user/mvitals-user.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes: Routes = [
  {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
    data: { role: 1, type: 'admin' },
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospitals',
    component: HospitalsComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'kiosks',
    component: KiosksComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospitals/hospital-details/:id',
    component: HospitalDetailsComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospitals/add-hospital',
    component: AddHospitalComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospitals/edit-hospital/:id',
    component: AddHospitalComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospital-type',
    component: HospitalHeTypesComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospital-service',
    component: HospitalAvailableServicesComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospital-departments',
    component: HospitalDepartmentComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },

  {
    path: 'ambulance-type',
    component: AmbulanceTypeComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },

  {
    path: 'ambulance-type/add-ambulance-type',
    component: AddAmbulanceTypeComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'ambulance-type/edit-ambulance-type/:id',
    component: AddAmbulanceTypeComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },

  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'customers/add-customers',
    component: AddCustomerComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'customers/edit-customer/:id',
    component: AddCustomerComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'ambulance',
    component: AmbulanceComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'ambulance/add-ambulance',
    component: AddAmbulanceComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'ambulance/ambulance-details/:id',
    component: AmbulanceDetailsComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'ambulance/edit-ambulance/:id',
    component: AddAmbulanceComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospitals-user',
    component: HospitalUserComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },

  {
    path: 'suffering',
    component: SufferingFromComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },

  {
    path: 'advertise',
    component: AdvertiseComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },

  {
    path: 'advertise/add-advertise',
    component: AddAdvertiseComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },

  {
    path: 'advertise/edit-advertise/:id',
    component: AddAdvertiseComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'driver',
    component: DriverComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'driver/add-driver',
    component: AddDriverComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'driver/edit-driver/:id',
    component: AddDriverComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'patients',
    component: PatientsComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'patients/patientDetails/:id',
    component: PatientDetailsComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'orders/add-orders',
    component: AddOrderComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'medicines',
    component: MedicinesComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'test-type',
    component: TestTypeComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'service-type',
    component: ServiceTypeComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'specialist-type',
    component: SpecialistTypeComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'medicines/add-medicines',
    component: AddMedicinesComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'medicine-delivery',
    component: MedicineDeliveryComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'medicine-delivery/add-medicine-delivery',
    component: AddMedicineDeliveryComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'medicine-delivery/edit-medicine-delivery/:id',
    component: AddMedicineDeliveryComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'homecare',
    component: HomecareComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'homecare/add-homecare',
    component: AddHomecareComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'homecare/edit-homecare/:id',
    component: AddHomecareComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'pathology',
    component: PathologyComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'pathology/add-pathology',
    component: AddPathologyComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'pathology/edit-pathology/:id',
    component: AddPathologyComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'doctor-consultation',
    component: DoctorConsultationComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'doctor-consultation/add-doctor-consultation',
    component: AddDoctorConsultationComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'doctor-consultation/edit-doctor-consultation/:id',
    component: AddDoctorConsultationComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'live-ambulance',
    component: LiveAmbulanceComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'book-ambulance',
    component: BookAnAmbulanceComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'on-boarded',
    component: OnBoardedComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'on-boarded-hospital',
    component: OnboardedHospitalComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'total-ambulance',
    component: AmbulanceReportComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'ambulance-rides',
    component: AmbulanceComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'driver-rides',
    component: DriverComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospital-rides',
    component: HospitalsComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'total-rides',
    component: TotalRidesComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospital-he-report',
    component: HospitalHeReportComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'hospital-to-hospital',
    component: HospitalToHospitalComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'iot/medtel',
    component: IotComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'iot-companies',
    component: IotCompaniesComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'mvitals-user',
    component: MvitalsUserComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'settings/menu',
    component: ManageMenuComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  },
  {
    path: 'settings/manage-users',
    component: ManageUsersComponent,
    canActivate: [AdminGuard, HasRoleGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class AdminRoutingModule {}
