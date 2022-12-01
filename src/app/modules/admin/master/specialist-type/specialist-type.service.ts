import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpecialistTypeService {
  baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   specialist-types

  // GET
  // /master/specialist-type/all
  // List All specialist-types
  getAllSpecialistType() {
    return this.http.get(this.baseUrl + 'master/specialist-type/all');
  }

  // GET
  // /master/specialist-type/getById/{id}
  // Get specialist-type Details
  getSpecialistTypeById(id: any) {
    return this.http.get(
      this.baseUrl + 'master/specialist-type/getById/' + { id },
    );
  }
  // POST
  // /master/specialist-type/save
  // Create specialist-type
  saveSpecialistType(data: any) {
    return this.http.post(this.baseUrl + 'master/specialist-type/save', data);
  }
  // PUT
  // /master/specialist-type/update/{id}
  // Update specialist-type
  updateSpecialistTypeById(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/specialist-type/update/' + id,
      data,
    );
  }
  // PUT
  // /master/specialist-type/updateStatus/{id}
  // Update specialist-type Status
  updateSpecialistTypeStatus(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/specialist-type/updateStatus/' + id,
      data,
    );
  }
}
