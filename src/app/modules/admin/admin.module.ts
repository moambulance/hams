import { HospitalHeReportComponent } from './reports/hospital-he-report/hospital-he-report.component';
import { AmbulanceReportComponent } from './reports/ambulance/ambulance-report.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddAmbulanceTypeComponent } from './ambulance/add-ambulance-type/add-ambulance-type.component';
import { AddAdvertiseComponent } from './advertise/add-advertise/add-advertise.component';
import { AdvertiseComponent } from './advertise/advertise.component';

import { AddAmbulanceComponent } from './ambulance/add-ambulance/add-ambulance.component';
import { AmbulanceDetailsComponent } from './ambulance/ambulance-details/ambulance-details.component';
import { AmbulanceComponent } from './ambulance/ambulance.component';
import { BookAnAmbulanceComponent } from './ambulance/book-an-ambulance/book-an-ambulance.component';
import { LiveAmbulanceComponent } from './ambulance/live-ambulance/live-ambulance.component';
import { AppWelcomePageComponent } from './app-welcome-page/app-welcome-page.component';
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
import { AdminSharedModule } from './shared/shared.module';
import { SufferingFromComponent } from './suffering-from/suffering-from.component';
import { SearchFilterPipe } from './pipe/search-filter.pipe';
import { PatientsComponent } from './patients/patients.component';
import { OrdersComponent } from './orders/orders.component';
import { AmbulanceTypeComponent } from './ambulance/ambulance-type/ambulance-type.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MedicinesComponent } from './master/medicines/medicines.component';
import { AddMedicinesComponent } from './master/medicines/add-medicines/add-medicines.component';
import { MedicineDeliveryComponent } from './other-services/medicine-delivery/medicine-delivery.component';
import { AddMedicineDeliveryComponent } from './other-services/medicine-delivery/add-medicine-delivery/add-medicine-delivery.component';

import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { HomecareComponent } from './other-services/homecare/homecare.component';
import { AddHomecareComponent } from './other-services/homecare/add-homecare/add-homecare.component';

import { PathologyComponent } from './other-services/pathology/pathology.component';
import { AddPathologyComponent } from './other-services/pathology/add-pathology/add-pathology.component';
import { AddDoctorConsultationComponent } from './other-services/doctor-consultaton/add-doctor-consultation/add-doctor-consultation.component';
import { DoctorConsultationComponent } from './other-services/doctor-consultaton/doctor-consultation.component';
import { TestTypeComponent } from './master/test-type/test-type.component';
import { ServiceTypeComponent } from './master/service-type/service-type.component';
import { SpecialistTypeComponent } from './master/specialist-type/specialist-type.component';
import { AddDriverComponent } from './driver/add-driver/add-driver.component';
import { AddOrderComponent } from './orders/add-order/add-order.component';
import { OnBoardedComponent } from './on-boarded/on-boarded.component';
import { OnboardedHospitalComponent } from './hospitals/onboarded-hospital/onboarded-hospital.component';
import { ReportsComponent } from './reports/reports.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TotalRidesComponent } from './reports/total-rides/total-rides.component';
import { KiosksComponent } from './hospitals/kiosks/kiosks.component';
import { HospitalToHospitalComponent } from './reports/hospital-to-hospital/hospital-to-hospital.component';
import { IotComponent } from './iot/iot.component';
import { MaterialModules } from 'src/app/material.module';
import { PatientDetailsComponent } from './patients/patient-details/patient-details.component';
import { SettingsComponent } from './settings/settings.component';
import { IotCompaniesComponent } from './iot/iot-companies/iot-companies.component';
import { MvitalsUserComponent } from './master/mvitals-user/mvitals-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AddAdminComponent,
    AmbulanceTypeComponent,
    HospitalDepartmentComponent,
    HospitalAvailableServicesComponent,
    HospitalHeTypesComponent,
    AppWelcomePageComponent,
    SufferingFromComponent,
    HospitalsComponent,
    AmbulanceComponent,
    AddHospitalComponent,
    HospitalDetailsComponent,
    AddAmbulanceTypeComponent,
    CustomersComponent,
    AddCustomerComponent,
    AddAmbulanceComponent,
    AmbulanceDetailsComponent,
    BookAnAmbulanceComponent,
    LiveAmbulanceComponent,
    HospitalUserComponent,
    AdvertiseComponent,
    AddAdvertiseComponent,
    DriverComponent,
    SearchFilterPipe,
    PatientsComponent,
    OrdersComponent,
    ChangePasswordComponent,
    MedicinesComponent,
    AddMedicinesComponent,
    MedicineDeliveryComponent,
    AddMedicineDeliveryComponent,
    HomecareComponent,
    AddHomecareComponent,
    PathologyComponent,
    AddPathologyComponent,
    DoctorConsultationComponent,
    AddDoctorConsultationComponent,
    TestTypeComponent,
    ServiceTypeComponent,
    SpecialistTypeComponent,
    AddDriverComponent,
    AddOrderComponent,
    OnBoardedComponent,
    OnboardedHospitalComponent,
    ReportsComponent,
    AmbulanceReportComponent,
    TotalRidesComponent,
    KiosksComponent,
    HospitalToHospitalComponent,
    HospitalHeReportComponent,
    IotComponent,
    PatientDetailsComponent,
    SettingsComponent,
    IotCompaniesComponent,
    MvitalsUserComponent,
    ManageMenuComponent,
    ManageUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    ChartsModule,
    AgmCoreModule,
    AgmDirectionModule,
    MaterialModules,
    NgSelectModule,
    SharedModule
  ],
  providers: [],
})
export class AdminModule {}
