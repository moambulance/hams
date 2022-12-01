import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalHeTypesService {
  baseUrl: any = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  // GET
  // /master/hospital-he-types/all
  // List All Hospital HE Types

  getHeTypes() {
    return this.http.get(this.baseUrl + 'master/hospital-he-types/all');
  }
  // GET
  // /master/hospital-he-types/getById/{id}
  // Get Hospital HE Type Details
  getHeTypesById(id: any) {
    return this.http.get(
      this.baseUrl + 'master/hospital-he-types/getById/' + id
    );
  }
  // POST
  // /master/hospital-he-types/save
  // Create Hospital HE Type
  createHeTypes(heData: any) {
    return this.http.post(this.baseUrl + 'master/hospital-he-types/save', heData);
  }
  // PUT
  // /master/hospital-he-types/update/{id}
  // Update Hospital HE Type
  updateHeTypes(id: any, heData: any) {
    return this.http.put(
      this.baseUrl + 'master/hospital-he-types/update/' + id,
      heData
    );
  }
  // PUT
  // /master/hospital-he-types/updateStatus/{id}
  // Update Hospital HE Type Status
  updateHeTypesStatusById(id: any, heData: any) {
    return this.http.put(
      this.baseUrl + 'master/hospital-he-types/updateStatus/' + id,
      heData
    );
  }
}
