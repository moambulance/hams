import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomecareService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  //   Home Care Service

  // GET
  // /homecare/all
  // List All Home Cares
  getAllHomecare() {
    return this.http.get(this.baseUrl + 'homecare/all');
  }
  // GET
  // /homecare/getById/{id}
  // Get HomeCare Details
  getHomecareById(id: any) {
    return this.http.get(this.baseUrl + 'homecare/getById/' + id);
  }
  // POST
  // /homecare/save
  // Create HomeCare
  saveHomecare(data: any) {
    return this.http.post(this.baseUrl + 'homecare/save', data);
  }
  // PUT
  // /homecare/update/{id}
  // Update HomeCare
  updateHomecare(id: any, data: any) {
    return this.http.put(this.baseUrl + 'homecare/update/' + id, data);
  }
  // PUT
  // /homecare/updateStatus/{id}
  // Update HomeCare Status
  updateHomecareById(id: any, data: any) {
    return this.http.put(this.baseUrl + 'homecare/updateStatus/' + id, data);
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
}
