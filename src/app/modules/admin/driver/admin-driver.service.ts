import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminDriverService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   Driver

  // GET
  // driver/all
  // List All Drivers
  getAllDrivers() {
    return this.http.get(this.baseUrl + 'driver/all');
  }

  // GET
  // driver/allActive
  // List All Active Drivers
  getActiveDrivers() {
    return this.http.get(this.baseUrl + 'driver/allActive');
  }
  // GET
  // driver/allActiveApproved
  // List All Active And Approved Drivers
  getActiveApprovedDrivers() {
    return this.http.get(this.baseUrl + 'driver/allActiveApproved');
  }
  // GET
  // driver/getById/{id}
  // Get Driver By id
  getDriverById(id: any) {
    return this.http.get(this.baseUrl + 'driver/getById/' + id);
  }
  // POST
  // driver/save
  // Create Driver
  addDriver(driverData: any) {
    return this.http.post(this.baseUrl + 'driver/save', driverData);
  }
  // POST
  // driver/saveBulkFromFirebase
  // Driver Bulk insert firebase
  addDrivers(driverData: any) {
    return this.http.post(
      this.baseUrl + 'driver/saveBulkFromFirebase',
      driverData,
    );
  }
  // PUT
  // driver/update/{id}
  // Update Driver
  updateDrivers(id: any, driverData: any) {
    return this.http.put(this.baseUrl + 'driver/update/' + id, driverData);
  }
  // POST
  // driver/login
  // Driver Login
  loginDriver(driverData: any) {
    return this.http.post(this.baseUrl + 'driver/login', driverData);
  }
  // PUT
  // driver/updateStatus/{id}
  // Update Driver Status
  updateDriverStatus(id: any, driverData: any) {
    console.log('llllddddddddddl');
    return this.http.put(
      this.baseUrl + 'driver/updateStatus/' + id,
      driverData,
    );
  }
  // PUT
  // driver/approve/{id}
  // Approve Driver
  updateDriverApprove(id: any, driverData: any) {
    return this.http.get(this.baseUrl + 'driver/approve/' + id, driverData);
  }
  // GET
  // driver/getDriverByAmbulance/{ambulance_id}
  // Get Driver By Ambulance_Id
  getDriverByAmbulanceId(id: any) {
    return this.http.get(this.baseUrl + 'driver/getDriverByAmbulance/' + id);
  }
}
