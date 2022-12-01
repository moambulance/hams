import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AmbulanceService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  //   Ambulance Details

  // GET
  // /ambulance/all
  // List All Ambulance

  getAllAmbulance() {
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

  getActiveApprovedAmbulance() {
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

  addAmbulance(ambulanceData: any) {
    return this.http.post(this.baseUrl + 'ambulance/save', ambulanceData);
  }

  // PUT
  // /ambulance/update/{id}
  // Update Ambulance

  updateAmbulance(id: any, ambulanceData: any) {
    return this.http.put(
      this.baseUrl + 'ambulance/update/' + id,
      ambulanceData,
    );
  }

  // PUT
  // /ambulance/updateStatus/{id}
  // Update Ambulance Status

  updateAmbulanceStatus(id: any, ambulanceData: any) {
    return this.http.put(
      this.baseUrl + 'ambulance/updateStatus/' + id,
      ambulanceData,
    );
  }

  // PUT
  // /ambulance/approve/{id}
  // Approve Ambulace

  updateAmbulanceApprove(id: any, ambulanceData: any) {
    return this.http.get(
      this.baseUrl + 'ambulance/approve/' + id,
      ambulanceData,
    );
  }

  // GET
  // /ambulance/getByRegistrationNumber/{regd_no}
  // Get all ambulance by registration number

  getAmbulanceByRegistration(regdNo: any) {
    return this.http.get(
      this.baseUrl + 'ambulance/getByRegistrationNumber' + regdNo,
    );
  }

  // GET
  // /ambulance/allByHospital/{hospital_id}
  // List All Ambulances by hospital id
  //

  getAmbulanceByHospital(hospital_id: any) {
    return this.http.get(
      this.baseUrl + 'ambulance/allByHospital/' + hospital_id,
    );
  }

  //   Ambulance Type

  // GET
  // /master/ambulance-type/all
  // List All Ambulance Types
  getAllAmbulanceTypes() {
    return this.http.get(this.baseUrl + 'master/ambulance-type/all');
  }

  // GET
  // /master/ambulance-type/getById/{id}
  // Get Ambulance Type Details

  getAmbulanceTypeById(id: any) {
    return this.http.get(this.baseUrl + 'master/ambulance-type/getById/' + id);
  }
  //   GET
  // /master/ambulance-type/getNameById/{id}
  // Get Ambulance Type name
  getAmbulanceTypeNameById(id: any) {
    return this.http.get(
      this.baseUrl + 'master/ambulance-type/getNameById/' + id,
    );
  }

  addCustomer(fd: any) {
    return this.http.post(this.baseUrl + 'customer/save', fd);
  }

  addPatient(fd: any) {
    return this.http.post(this.baseUrl + 'patient/save', fd);
  }
  
  addPatientMedtel(fd: any, type?:string) {
    return this.http.post(`${this.baseUrl}patient/${type == "ezeRx" ? 'ezeRxPatientSave' : 'medtelPatientSave'}`, fd);
  }
  
  addPatientEzeRx(fd: any) {
    return this.http.post(this.baseUrl + 'patient/ezeRxPatientSave', fd);
  }

  getAvailableAmbulance(id: any) {
    return this.http.get(
      this.baseUrl + 'orders/allAmbulanceAvailableByHospital/' + id,
    );
  }
  //   GET
  // /orders/allAmbulanceTypeAvailableByHospital/{hospital_id}/{typeId}
  // Get Ambulance list by hospital with on trip status
  allAmbulanceTypeAvailableByHospital(hospital_id: any, typeId: any) {
    return this.http.get(
      this.baseUrl +
        `/orders/allAmbulanceTypeAvailableByHospital/${hospital_id}/${typeId}`,
    );
  }

  getAmbulanceFareDetails(fd: any) {
    return this.http.post(this.baseUrl + 'orders/fareDetails', fd);
  }

  getDriverByAmbulanceId(id: any) {
    return this.http.get(this.baseUrl + 'driver/getDriverByAmbulance/' + id);
  }

  getHospitalById(id: any) {
    return this.http.get(this.baseUrl + 'hospital/getById/' + id);
  }

  saveTransaction(fd: any) {
    return this.http.post(this.baseUrl + 'orders/saveTransaction', fd);
  }

  instantOrder(fd: any) {
    return this.http.post(this.baseUrl + 'orders/instantOrder', fd);
  }

  //   GET
  // /ambulance/allByHospital/{hospital_id}
  // List All Ambulances by hospital id
  getAllAmbulanceByHospitalId(hospital_id: any) {
    return this.http.get(
      this.baseUrl + `ambulance/allByHospital/` + hospital_id,
    );
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
}
