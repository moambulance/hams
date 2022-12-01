import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceTypeService {
  baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   service-types

  // GET
  // /master/service-type/all
  // List All service-types
  getAllServiceType() {
    return this.http.get(this.baseUrl + 'master/service-type/all');
  }

  // GET
  // /master/service-type/getById/{id}
  // Get service-type Details
  getServiceTypeById(id: any) {
    return this.http.get(
      this.baseUrl + 'master/service-type/getById/' + { id },
    );
  }
  // POST
  // /master/service-type/save
  // Create service-type
  saveServiceType(data: any) {
    return this.http.post(this.baseUrl + 'master/service-type/save', data);
  }
  // PUT
  // /master/service-type/update/{id}
  // Update service-type
  updateServiceTypeById(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/service-type/update/' + id,
      data,
    );
  }
  // PUT
  // /master/service-type/updateStatus/{id}
  // Update service-type Status
  updateServiceTypeStatus(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/service-type/updateStatus/' + id,
      data,
    );
  }
}
