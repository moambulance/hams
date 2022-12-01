import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AmbulanceService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   Ambulance Details

  // GET
  // /ambulance/all
  // List All Ambulance
  getAmbulance() {
    return this.http.get(this.baseUrl + 'ambulance/all');
  }
  // GET
  // /ambulance/allActive
  // List All Active Ambulance
  getActiveAmbulance() {
    return this.http.get(this.baseUrl + 'ambulance/allActive');
  }
  // GET
  // /ambulance/allActiveApproved
  // List All Active and Approved Ambulances
  getActiveAmbulanceApproved() {
    return this.http.get(this.baseUrl + 'ambulance/allActiveApproved');
  }
  // GET
  // /ambulance/getById/{id}
  // Get Ambulance Details
  getAmbulanceById(id: any) {
    return this.http.get(this.baseUrl + 'ambulance/getById/' + id);
  }
  // POST
  // /ambulance/save
  // Create Ambulance
  addAmbulance(data: any) {
    return this.http.post(this.baseUrl + 'ambulance/save', data);
  }
  // PUT
  // /ambulance/update/{id}
  // Update Ambulance
  updateAmbulance(id: any, data: any) {
    return this.http.put(this.baseUrl + 'ambulance/update/' + id, data);
  }
  // PUT
  // /ambulance/updateStatus/{id}
  // Update Ambulance Status
  updateAmbulanceStatus(id: any, data: any) {
    return this.http.put(this.baseUrl + 'ambulance/updateStatus/' + id, data);
  }
  // PUT
  // /ambulance/approve/{id}
  // Approve Ambulance
  updateAmbulanceApprove(id: any, data: any) {
    return this.http.put(this.baseUrl + 'ambulance/approve/' + id, data);
  }
  // GET
  // /ambulance/getByRegistrationNumber/{regd_no}
  // Get all ambulance by registration number
  getAmbulanceByRegistrationNumber(regdNo: any) {
    return this.http.get(
      this.baseUrl + 'ambulance/getByRegistrationNumber/' + regdNo,
    );
  }
  // GET
  // /ambulance/allByHospital/{hospital_id}
  // List All Ambulances by hospital id
  getAmbulanceByHospitalId(id: any) {
    return this.http.get(this.baseUrl + 'ambulance/allByHospital/' + id);
  }

  getAllAmbulanceTypes() {
    return this.http.get(this.baseUrl + 'master/ambulance-type/all');
  }
  getAllAmbulanceByHospitalId(hospital_id: any) {
    return this.http.get(
      this.baseUrl + `ambulance/allByHospital/` + hospital_id,
    );
  }
  // GET
  // /ambulance/getAllAmbulanceWithDriver
  // List All Ambulances by Driver
  getAllAmbulanceWithDriver() {
    return this.http.get(this.baseUrl + 'ambulance/getAllAmbulanceWithDriver');
  }
  updateAssignedHospital(data: any) {
    return this.http.post(
      this.baseUrl + 'ambulance/updateAssignedHospital',
      data,
    );
  }

  addCustomer(fd: any) {
    return this.http.post(this.baseUrl + 'customer/save', fd);
  }
  //   PUT
  // /customer/update/{id}
  // Update Customer
  updateCustomer(id: any, fd: any) {
    return this.http.put(this.baseUrl + 'customer/update/' + id, fd);
  }

  addPatient(fd: any) {
    return this.http.post(this.baseUrl + 'patient/save', fd);
  }
  //   PUT
  // /patient/update/{id}
  // Update Patient
  updatePatient(id: any, fd: any) {
    return this.http.put(this.baseUrl + 'patient/update/' + id, fd);
  }
  //   GET
  // /patient/getById/{id}
  // Get Patient By id
  getPatientById(id: any) {
    return this.http.get(this.baseUrl + 'patient/getById/' + id);
  }
  getAmbulanceFareDetails(fd: any) {
    return this.http.post(this.baseUrl + 'orders/fareDetails', fd);
  }
  saveTransaction(fd: any) {
    return this.http.post(this.baseUrl + 'orders/saveTransaction', fd);
  }

  instantOrder(fd: any) {
    return this.http.post(this.baseUrl + 'orders/instantOrder', fd);
  }
  // GET
  // /patient/getByPhone/{phone}
  // Get Patient By phone
  getPatientDetailsByMobile(phone: any) {
    return this.http.get(this.baseUrl + `patient/getByPhone/` + phone);
  }
  //   GET
  // /ambulance/findByRegdNo/{number}
  // List All Ambulance
  findByRegdNo(regdNo: any) {
    return this.http.get(this.baseUrl + `ambulance/findByRegdNo/${regdNo}`);
  }

  //   GET
  // /reports/getAmbulanceRides/{ambulanceId}/{startDate}/{endDate}
  // Total Rides Of Ambulance Filter By Date
  getAmbulanceRides(ambulanceId: any, startDate: any, endDate: any) {
    return this.http.get(
      this.baseUrl +
        `reports/getAmbulanceRides/${ambulanceId}/${startDate}/${endDate}`,
    );
  }
}
