import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient, private router: Router) {}

  // GET
  // /hospital/all
  // List All Hospitals
  getAllHospital() {
    return this.http.get(this.baseUrl + 'hospital/all');
  }
  // GET
  // /hospital/allActive
  // List All Active Hospitals
  getAllActiveHospital() {
    return this.http.get(this.baseUrl + 'hospital/allActive');
  }
  // GET
  // /hospital/allActiveApproved
  // List All Active And Approved Hospitals
  getAllActiveApprovedHospital() {
    return this.http.get(this.baseUrl + 'hospital/allActiveApproved');
  }

  // PUT
  // /hospital/updateLogo/{id}
  // Update Hospital Logo
  updateHospitalLogoById(id: any, hospitalData: any) {
    return this.http.put(this.baseUrl + 'hospital/approve/' + id, hospitalData);
  }
  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('refreshtoken');
    this.router.navigate(['/login']);
  }

  //   Suffering From

  // GET
  // /master/suffering-from/all
  // List All Suffering From
  getAllSufferingFrom() {
    return this.http.get(this.baseUrl + 'master/suffering-from/all');
  }

  // GET
  // /master/suffering-from/getById/{id}
  // Get Suffering From Details

  getSufferingFromById(id: any) {
    return this.http.get(this.baseUrl + 'master/suffering-from/getById/' + id);
  }

  // POST
  // /master/suffering-from/save
  // Create Suffering From

  addSufferingFrom(sufferingFrom: any) {
    return this.http.post(
      this.baseUrl + '/master/suffering-from/save',
      sufferingFrom,
    );
  }

  // PUT
  // /master/suffering-from/update/{id}
  // Update Suffering From

  updateSufferingFrom(id: any, sufferingFrom: any) {
    return this.http.put(
      this.baseUrl + 'master/suffering-from/update/' + id,
      sufferingFrom,
    );
  }

  // PUT
  // /master/suffering-from/updateStatus/{id}
  // Update Suffering From Status

  updateSufferingFromStatus(id: any, sufferingFrom: any) {
    return this.http.put(
      this.baseUrl + 'master/suffering-from/updateStatus/' + id,
      sufferingFrom,
    );
  }

  getOrdersByHospital(hospital_id: number, type: number) {
    return this.http.get(
      `${this.baseUrl}orders/getByHospitalId/${hospital_id}/${type}`,
    );
  }
  //   GET
  // /orders/ongoingOrdersByKiosks / { hospital_id }
  // List All Orders By Hospital Id

  ongoingOrdersByKiosks(hospital_id: number) {
    return this.http.get(
      `${this.baseUrl}orders/ongoingOrdersByKiosks/${hospital_id}`,
    );
  }
  //   GET
  // /orders/completeOrdersByKiosks / { hospital_id }
  // List All Orders By Hospital Id
  completeOrdersByKiosks(hospital_id: number) {
    return this.http.get(
      `${this.baseUrl}orders/completeOrdersByKiosks/${hospital_id}`,
    );
  }

  // Order
  //   GET
  // /orders/onTripCountByHospital/{hospital_id}
  // Get on Trip Count by hospital
  getOrderOnTripCountByHospital(hospitalId: any) {
    return this.http.get(
      `${this.baseUrl}orders/onTripCountByHospital/${hospitalId}`,
    );
  }

  getHospitalFromLocation(location: any) {
    return this.http.get(
      `${this.baseUrl}orders/getHospitalFromLocation/${location}`,
    );
  }

  getDestinationHospitalOrders(hospitalId: any) {
    return this.http.get(
      `${this.baseUrl}orders/findAllByDestinationHospitalAll/${hospitalId}`,
    );
  }

  getDriversByHospital(hospitalId: any) {
    return this.http.get(
      `${this.baseUrl}driver/getDriversByHospital/${hospitalId}`,
    );
  }
  //   POST
  // /hospital/users/changePassword
  // Hospital Change Password
  changePassword(id: any, password: any) {
    return this.http.post(
      `${this.baseUrl}hospital/users/changePassword`,
      password,
    );
  }

  getHamsReportForHospital(
    hospital_id: number,
    call_type: string,
    start_date?: string,
    end_date?: string,
    ambulance_type_id?: number,
  ) {
    return this.http.get(
      `${this.baseUrl}reports/getHamsReports/${start_date}/${end_date}/${call_type}/${hospital_id}/${ambulance_type_id}`,
    );
  }
  // GET
  // /reports/getMoAmbulancePatientReport/{start_date}/{end_date}/{hospital_id}
  // get hams report
  getMoAmbulancePatientReport(startDate: any, endDate: any, hospital_id: any) {
    return this.http.get(
      this.baseUrl +
        `reports/getMoAmbulancePatientReport/${startDate}/${endDate}/${hospital_id}`,
    );
  }

  // get hams report
  loginHospital(loginData: any) {
    return this.http.post(this.baseUrl + 'hospital/users/login', loginData);
  }

  createHospitalUser(data: any) {
    return this.http.post(this.baseUrl + 'hospital/users/createUser', data);
  }

  // GET
  // /hospital/getById/{id}
  // Get Hospital Details By id
  getHospitalById(id: any) {
    return this.http.get(this.baseUrl + 'hospital/getById/' + id);
  }
  // GET
  // /hospital/getDriversById/{id}
  // Get Hospital Details with ambulance and drivers By id
  getHospitalByDriversId(id: any) {
    return this.http.get(this.baseUrl + 'hospital/getDriversById/' + id);
  }
  // POST
  // /hospital/save
  // Create Hospital
  addHospital(hospitalData: any) {
    return this.http.post(this.baseUrl + 'hospital/save', hospitalData);
  }
  // PUT
  // /hospital/update/{id}
  // Update Hospital
  updateHospital(id: any, hospitalData: any) {
    return this.http.put(this.baseUrl + 'hospital/update/' + id, hospitalData);
  }
  // PUT
  // /hospital/updateStatus/{id}
  // Update Hospital Status
  updateHospitalStatus(id: any, hospitalData: any) {
    return this.http.put(
      this.baseUrl + 'hospital/updateStatus/' + id,
      hospitalData,
    );
  }
  // GET
  // /hospital/filter/{name}
  // Get all hospitals by name
  getHospitalByName(name: any) {
    return this.http.get(this.baseUrl + '/hospital/filter/' + name);
  }
  // PUT
  // /hospital/approve/{id}
  // Approve Hospital
  updateApproveHospital(id: any, hospitalData: any) {
    return this.http.put(this.baseUrl + 'hospital/approve/' + id, hospitalData);
  }
  // POST
  // /hospital/changePassword
  // Hospital Change Password
  changeHospitalPassword(passwordData: any) {
    return this.http.post(this.baseUrl + 'hospital/save', passwordData);
  }

  getHospitalAvailableServices() {
    return this.http.get(
      this.baseUrl + 'master/hospital-available-services/all',
    );
  }

  getHospitalDepartments() {
    return this.http.get(this.baseUrl + 'master/hospital-departments/all');
  }

  getHeTypes() {
    return this.http.get(this.baseUrl + 'master/hospital-he-types/all');
  }

  getCountry() {
    return this.http.get(this.baseUrl + 'getCounties');
  }

  getStateByCountryId(id: any) {
    return this.http.get(this.baseUrl + 'getStatesByCountry/' + id);
  }

  getCitiesByStateId(id: any) {
    return this.http.get(this.baseUrl + 'getCitiesByState/' + id);
  }
  // Hospital Users
  //   GET
  // /hospital/users/all
  // List All Hospitals Users

  getAllHospitalUsers() {
    return this.http.get(this.baseUrl + 'hospital/users/all');
  }
  // GET
  // /hospital/users/getById/{id}
  // Get Hospital Details By id
  getAllHospitalUserById(id: any) {
    return this.http.get(this.baseUrl + 'hospital/users/getById/' + id);
  }

  // PUT
  // /hospital/users/updateStatus/{id}
  // Update Hospital User Status
  updateHospitalUserStatus(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'hospital/users/updateStatus/' + id,
      data,
    );
  }
  // PUT
  // /hospital/users/updateRole/{id}
  // Update Hospital User Role
  updateHospitalUserRole(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'hospital/users/updateRole/' + id,
      data,
    );
  }

  //   GET
  // /master/hospital-available-services/getById/{id}
  // Get Hospital Available service Details
  getHospitalServiceById(id: any) {
    return this.http.get(
      this.baseUrl + 'master/hospital-available-services/getById/' + id,
    );
  }
  //   Hospital Details

  // GET
  // /hospital/details/all
  // List All Hospital Details

  getAllHospitalDetails() {
    return this.http.get(this.baseUrl + 'hospital/details/all');
  }
  // GET
  // /hospital/details/getById/{id}
  // Get Hospital Details By id
  getHospitalDetailsById(id: any) {
    return this.http.get(this.baseUrl + 'hospital/details/getById/' + id);
  }
  // GET
  // /hospital/details/getByHospitalId/{hospital_id}
  // Get Hospital Details By hospital id
  getHospitalDetailsByHospitalId(hospital_id: any) {
    return this.http.get(
      this.baseUrl + 'hospital/details/getByHospitalId/' + hospital_id,
    );
  }
  // POST
  // /hospital/details/save
  // Create Hospital Details
  saveHospitalDetails(data: any) {
    return this.http.post(this.baseUrl + 'hospital/details/save/', data);
  }

  //   PUT
  // /hospital/details/update/{id}
  // Update Hospital Details
  updateHospitalDetailsById(hospital_id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'hospital/details/update/' + hospital_id,
      data,
    );
  }
  //   GET
  // /hospital/dasboardByHospitalId/{id}
  getHospitalData(id: any) {
    return this.http.get(this.baseUrl + 'hospital/dasboardByHospitalId/' + id);
  }

  getPatientsByIotCompany(iot_company_id: number) {
    return this.http.get(`${this.baseUrl}patient/allByIotCompany/${iot_company_id}`)
  }
  
  getPatientsByMvitalUser(mvital_user_id: number) {
    return this.http.get(`${this.baseUrl}patient/getAllByMvitalUserId/${mvital_user_id}`)
  }
 
  getMvitalUserDetailsById(userId: number) {
    return this.http.get(`${this.baseUrl}master/mvitals-user/getById/${userId}`)
  }


}
