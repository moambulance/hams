import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestTypeService {
  baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   test-types

  // GET
  // /master/test-type/all
  // List All test-types
  getAllTestType() {
    return this.http.get(this.baseUrl + 'master/test-type/all');
  }

  // GET
  // /master/test-type/getById/{id}
  // Get test-type Details
  getTestTypeById(id: any) {
    return this.http.get(this.baseUrl + 'master/test-type/getById/' + { id });
  }
  // POST
  // /master/test-type/save
  // Create test-type
  saveTestType(data: any) {
    return this.http.post(this.baseUrl + 'master/test-type/save', data);
  }
  // PUT
  // /master/test-type/update/{id}
  // Update test-type
  updateTestTypeById(id: any, data: any) {
    return this.http.put(this.baseUrl + 'master/test-type/update/' + id, data);
  }
  // PUT
  // /master/test-type/updateStatus/{id}
  // Update test-type Status
  updateTestTypeStatus(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/test-type/updateStatus/' + id,
      data,
    );
  }
}
