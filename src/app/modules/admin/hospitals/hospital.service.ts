import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) { }
  //   Hospitals
  // POST
  // /hospital/login
  // Hospital Login
  loginHospital(loginData: any) {
    return this.http.post(this.baseUrl + 'hospital/login', loginData);
  }

  createHospitalUser(data: any) {
    return this.http.post(this.baseUrl + 'hospital/users/createUser', data);
  }
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
  // PUT
  // /hospital/updateLogo/{id}
  // Update Hospital Logo
  updateHospitalLogoById(id: any, hospitalData: any) {
    return this.http.put(this.baseUrl + 'hospital/approve/' + id, hospitalData);
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
  // PUT
  // /hospital/users/updateUser
  // Update Hospital User
  updateHospitalUser(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'hospital/users/updateUser/' + id,
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
  // PUT
  // /hospital/details/update/{id}
  // Update Hospital Details
  //
  updateHospitalDetailsByHospitalId(hospital_id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'hospital/details/update/' + hospital_id,
      data,
    );
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
  getCityByCityId(id: string) {
    return this.http.get(this.baseUrl + 'getCityByCityId/' + id);
  }
  getStateByStateId(id: any) {
    return this.http.get(this.baseUrl + 'getStateByStateId/' + id);
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
  // /hospital/filterHospitalByName/{name}
  // Get all Hospital by name
  filterHospitalByName(name: any) {
    return this.http.get(
      `${this.baseUrl}hospital/filterHospitalByName/${name}`,
    );
  }
  //   GET
  // /reports/getHospitalRides / { hospitalId } / { typeId } / { startDate } / { endDate }
  // Total Rides Of Hospital Filter By Date and Ambulance Type



  getHospitalRides(hospitalId: any, typeId: any, startDate: any, endDate: any) {
    return this.http.get(
      this.baseUrl +
      `reports/getHospitalRides/${hospitalId}/${typeId}/${startDate}/${endDate}`,
    );
  }
  // @Get('getCityByCityId/:city_id')
  // getCityByCityId(@Param('city_id') city_id: string) {
  //   return this.appService.getCityByCityId(parseInt(city_id));
  // }
  // @Get('getStateByStateId/:state_id')
  // getStateByStateId(@Param('state_id') state_id: string) {
  //   return this.appService.getStateByStateId(parseInt(state_id));
  // }
}
