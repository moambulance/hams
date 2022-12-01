import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PathologyService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  // Pathology Service

  // GET
  // /pathology/all
  // List All Pathology

  getAllPathology() {
    return this.http.get(this.baseUrl + 'pathology/all');
  }
  // GET
  // /pathology/getById/{id}
  // Get Pathology Details
  getPathologyById(id: any) {
    return this.http.get(this.baseUrl + 'pathology/getById/' + id);
  }

  // POST
  // /pathology/save
  // Create Pathology
  savePathology(data: any) {
    return this.http.post(this.baseUrl + 'pathology/save', data);
  }

  // PUT
  // /pathology/update/{id}
  // Update Pathology
  updatePathology(id: any, data: any) {
    return this.http.put(this.baseUrl + 'pathology/update/' + id, data);
  }

  // PUT
  // /pathology/updateStatus/{id}
  // Update Pathology Status
  updatePathologyById(id: any, data: any) {
    return this.http.put(this.baseUrl + 'pathology/updateStatus/' + id, data);
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
