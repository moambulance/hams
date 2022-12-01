import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AmbulanceTypeService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  //   Ambulance Type

  // GET
  // /master/ambulance-type/all
  // List All Ambulance Types
  getAmbulanceType() {
    return this.http.get(this.baseUrl + 'master/ambulance-type/all');
  }
  // GET
  // /master/ambulance-type/getById/{id}
  // Get Ambulance Type Details
  getAmbulanceTypeById(id: any) {
    return this.http.get(this.baseUrl + 'master/ambulance-type/getById/' + id);
  }
  // POST
  // /master/ambulance-type/save
  // Create Ambulance Type
  createAmbulanceType(data: any) {
    return this.http.post(this.baseUrl + 'master/ambulance-type/save', data);
  }
  // PUT
  // /master/ambulance-type/update/{id}
  // Update Ambulance Type
  updateAmbulanceTypeById(id: any, data: any) {
    return this.http.put(this.baseUrl + 'master/ambulance-type/update/' + id, data);
  }
  // PUT
  // /master/ambulance-type/updateStatus/{id}
  // Update Ambulance Type Status
  updateAmbulanceTypeStatus(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/ambulance-type/updateStatus/' + id,
      data
    );
  }
}
