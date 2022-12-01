import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalDepartmentService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   GET
  // /master/hospital-departments/all
  // List All Hospital Departments

  getHospitalDepartments() {
    return this.http.get(this.baseUrl + 'master/hospital-departments/all');
  }
  // GET
  // /master/hospital-departments/getById/{id}
  // Get Hospital Department Details
  getHospitalDepartmentsByID(id: any) {
    return this.http.get(this.baseUrl + 'master/hospital-departments/getById/' + id);
  }
  // POST
  // /master/hospital-departments/save
  // Create Hospital Department
  createHospitalDepartments(data: any) {
    return this.http.post(this.baseUrl + 'master/hospital-departments/save', data);
  }
  // PUT
  // /master/hospital-departments/update/{id}
  // Update Hospital Department
  updateHospitalDepartments(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/hospital-departments/update/' + id,
      data
    );
  }

  // PUT
  // /master/hospital-departments/updateStatus/{id}
  // Update Hospital Department Status
  updateHospitalDepartmentsById(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/hospital-departments/updateStatus/' + id,
      data
    );
  }
}
