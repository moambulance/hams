import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReportService } from './report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  dashBoardData: any;
  endDate: any;
  startDate: any;

  selectedHospital: any;
  hospitalList: any;

  selectedAmbulanceType: any;
  ambulanceTypes: any;

  selectedHospitalType: any;
  hospitalTypes: any;

  selectedSufferingFrom: any;
  sufferingFrom: any;

  selectedDriver: any;
  driverList: any;

  selectedAmbulance: any;
  ambulanceList: any;

  selectedCustomer: any;
  customerList: any;

  selectedPatient: any;
  patientList: any;

  selectedHospitalService: any;
  hospitalServiceList: any;

  selectedHospitalDepartment: any;
  hospitalDepartmentList: any;

  selectedSpecialist: any;
  specialistList: any;

  selectedTest: any;
  testList: any;

  selectedService: any;
  serviceList: any;

  // selectedOrder: any;
  // orderList: any;
  // selectedPatient: any;
  // patientList: any;

  reportForm: any;
  breadCrumbData: any = {
    heading: 'Reports',
    routing: [
      {
        routerHeading: 'reports',
        routerLink: '/admin/reports',
      },
    ],
  };

  constructor(
    private reportService: ReportService,
    private formBuilder: FormBuilder,
  ) {
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      ambulance_type_id: [0, []],
    });
  }

  ngOnInit(): void {
    this.getHospitals();
    this.getAmbulanceTypes();
    this.getSufferingFrom();
    this.getHospitalType();
    this.getDrivers();
    this.getAmbulances();
    this.getHospitalServices();
    this.getPatients();
    this.getHospitalDepartment();
    this.getSpecialistType();
    this.getTestType();
    this.serviceType();
    // this.getOrders();
  }

  // Get All ACtive And Approved Hospital
  getHospitals() {
    this.reportService
      .getAllActiveApprovedHospital()
      .subscribe((response: any) => {
        this.hospitalList = response.map((rs: any) => {
          return {
            id: rs.id,
            name: rs.name.toUpperCase(),
          };
        });
      });
  }
  // Get All AMbulance Types
  getAmbulanceTypes() {
    this.reportService.getAllAmbulanceTypes().subscribe((response: any) => {
      this.ambulanceTypes = response.filter((res: any) => {
        if (res.is_active === 1) {
          return { id: res.id, name: res.name };
        }
        return;
      });
    });
  }
  // Get All Suffering From Types
  getSufferingFrom() {
    this.reportService.getSufferingFrom().subscribe((response: any) => {
      this.sufferingFrom = response.map((res: any) => {
        return { id: res.id, name: res.name.toUpperCase() };
      });
    });
  }
  // Get All Hospital Type
  getHospitalType() {
    this.reportService.getHeTypes().subscribe((response: any) => {
      this.hospitalTypes = response.map((res: any) => {
        return { id: res.id, name: res.name.toUpperCase() };
      });
    });
  }
  // Get All Drivers
  getDrivers() {
    this.reportService.getAllDrivers().subscribe((response: any) => {
      this.driverList = response.map((res: any) => {
        return { id: res.id, name: res.name.toUpperCase() };
      });
    });
  }
  // Get All Ambulances
  getAmbulances() {
    this.reportService
      .getActiveAmbulanceApproved()
      .subscribe((response: any) => {
        this.ambulanceList = response.map((res: any) => {
          return {
            id: res.id,
            name: `${res.registration_number.toUpperCase()} (${res.ambulance_type_id.name.toUpperCase()})`,
          };
        });
      });
  }
  // Get All Patients
  getPatients() {
    this.reportService.getAllPatients().subscribe((response: any) => {
      this.patientList = response.map((res: any) => {
        return {
          id: res.id,
          name: res.name.toUpperCase(),
        };
      });
    });
  }
  // Get All Hospital Services
  getHospitalServices() {
    this.reportService
      .getHospitalAvailableServices()
      .subscribe((response: any) => {
        this.hospitalServiceList = response.map((res: any) => {
          return {
            id: res.id,
            name: res.name.toUpperCase(),
          };
        });
      });
  }
  // Get All  Hospital Department
  getHospitalDepartment() {
    this.reportService.getHospitalDepartments().subscribe((response: any) => {
      this.hospitalDepartmentList = response.map((res: any) => {
        return {
          id: res.id,
          name: res.name.toUpperCase(),
        };
      });
    });
  }
  // Get All Specialist Type
  getSpecialistType() {
    this.reportService.getAllSpecialistType().subscribe((response: any) => {
      this.specialistList = response.map((res: any) => {
        return {
          id: res.id,
          name: res.name.toUpperCase(),
        };
      });
    });
  }
  // Get All Test Type List
  getTestType() {
    this.reportService.getAllTestType().subscribe((response: any) => {
      this.testList = response.map((res: any) => {
        return {
          id: res.id,
          name: res.name.toUpperCase(),
        };
      });
    });
  }
  // Get All Service Type List
  serviceType() {
    this.reportService.getAllServiceType().subscribe((response: any) => {
      // console.log('serviceList', response);

      this.serviceList = response.map((res: any) => {
        return {
          id: res.id,
          name: res.name.toUpperCase(),
        };
      });
    });
  }
  // Get All Orders
  // getOrders() {
  //   this.reportService.getAllOrders().subscribe((response: any) => {
  //     console.log('order', response);

  //     this.orderList = response.map((res: any) => {
  //       return {
  //         id: res.id,
  //         name: `${res.registration_number} (${res.ambulance_type_id.name})`,
  //       };
  //     });
  //   });
  // }
  onFilter() {
    // console.log()
    this.startDate = this.reportForm.value['start_date'];
    this.endDate = this.reportForm.value['end_date'];
    // this.getReport(this.startDate, this.endDate);
    console.log('start date ', this.reportForm.value['start_date']);
    console.log('end date ', this.reportForm.value['end_date']);
    console.log('AT_id ', this.reportForm.value['ambulance_type_id']);
  }
}
