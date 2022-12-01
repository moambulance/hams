import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalAvailableServicesService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   Hospital Available Services

  // GET
  // /master/hospital-available-services/all
  // List All Hospital Available services
  getHospitalAvailableServices() {
    return this.http.get(this.baseUrl + 'master/hospital-available-services/all');
  }

  // GET
  // /master/hospital-available-services/getById/{id}
  // Get Hospital Available service Details
  getHospitalAvailableServicesById(id: any) {
    return this.http.get(
      this.baseUrl + 'master/hospital-available-services/getById/' + id
    );
  }
  // POST
  // /master/hospital-available-services/save
  // Create Hospital Available service
  createHospitalAvailableServices(data: any) {
    return this.http.post(
      this.baseUrl + 'master/hospital-available-services/save',
      data
    );
  }
  // PUT
  // /master/hospital-available-services/update/{id}
  // Update Hospital Available service
  updateHospitalAvailableServices(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/hospital-available-services/update/' + id,
      data
    );
  }
  // PUT
  // /master/hospital-available-services/updateStatus/{id}
  // Update Hospital Available service Status
  updateHospitalAvailableServicesStatus(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/hospital-available-services/updateStatus/' + id,
      data
    );
  }
}
