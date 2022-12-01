import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) { }
  getAllActiveApprovedHospital() {
    return this.http.get(this.baseUrl + 'hospital/allActiveApproved');
  }
  getAllAmbulanceTypes() {
    return this.http.get(this.baseUrl + 'master/ambulance-type/all');
  }
  getHeTypes() {
    return this.http.get(this.baseUrl + 'master/hospital-he-types/all');
  }
  getSufferingFrom() {
    return this.http.get(this.baseUrl + 'master/suffering-from/all');
  }
  getActiveAmbulanceApproved() {
    return this.http.get(this.baseUrl + 'ambulance/allActiveApproved');
  }
  getAllDrivers() {
    return this.http.get(this.baseUrl + 'driver/all');
  }
  getAllOrders() {
    return this.http.get(this.baseUrl + 'orders/all/');
  }
  getAllPatients() {
    return this.http.get(this.baseUrl + 'patient/all');
  }
  getHospitalAvailableServices() {
    return this.http.get(
      this.baseUrl + 'master/hospital-available-services/all',
    );
  }
  getHospitalDepartments() {
    return this.http.get(this.baseUrl + 'master/hospital-departments/all');
  }
  getAllSpecialistType() {
    return this.http.get(this.baseUrl + 'master/specialist-type/all');
  }
  getAllTestType() {
    return this.http.get(this.baseUrl + 'master/test-type/all');
  }
  getAllServiceType() {
    return this.http.get(this.baseUrl + 'master/service-type/all');
  }

  //   GET
  // /reports/getTotalAmbulancesByType
  // Total ambulances Ambulance Type wise
  getAmbulancesByTypeReport() {
    return this.http.get(this.baseUrl + 'reports/getTotalAmbulancesByType');
  }

  //   GET
  // /reports/getHospitalWithAmbulance
  // Hospital With Number of Ambulance
  getHospitalWithAmbulance() {
    return this.http.get(this.baseUrl + 'reports/getHospitalWithAmbulance');
  }
  //   GET
  // /reports/getHospitalReportByHeTypes
  // get Hospital Report By HeTypes
  getHospitalReportByHeTypes() {
    return this.http.get(this.baseUrl + 'reports/getHospitalReportByHeTypes')
  }
  //   GET
  // /reports/getHospitalToHospitalRides / { hospitalId } / { destHospitalId } / { startDate } / { endDate }
  // Total Rides From Hospital To Hospital
  getHospitalToHospitalRides(hospitalId: any, destHospitalId: any, startDate: any, endDate: any) {
    return this.http.get(this.baseUrl + `reports/getHospitalToHospitalRides/${hospitalId}/${destHospitalId}/${startDate}/${endDate}`)
  }
}
