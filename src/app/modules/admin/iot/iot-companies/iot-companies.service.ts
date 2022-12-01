import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IotCompaniesService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  // Iot Companies

  // GET
  // /master/iot-companies/getIotCompany
  // Get All Company Details

  getIotCompanies() {
    return this.http.get(this.baseUrl + 'master/iot-companies/getIotCompany');
  }

  // GET
  // /master/iot-companies/getIotCompany/{id}
  // Get Company Details

  getIotCompaniesById(id: any) {
    return this.http.get(
      this.baseUrl + `master/iot-companies/getIotCompany/${id}`,
    );
  }
  // DELETE

  // /master/iot-companies/deleteIotCompany/{id}
  // Get Company Details

  deleteIotCompaniesById(id: any) {
    return this.http.delete(
      this.baseUrl + `master/iot-companies/deleteIotCompany/${id}`,
    );
  }
  // PUT
  // /master/iot-companies/isCustomised/{id}
  // Update Company Customised Price Status
  updateisCustomisedById(id: any, data: any) {
    return this.http.put(
      this.baseUrl + `master/iot-companies/isCustomised/${id}`,
      data,
    );
  }
  // PUT
  // /master/iot-companies/updateStatus/{id}
  // Update Company Customised Price Status
  updateStatusByCompaniesById(id: any, data: any) {
    return this.http.put(
      this.baseUrl + `master/iot-companies/updateStatus/${id}`,
      data,
    );
  }
  // POST
  // /master/iot-companies/save
  // Create New IotCompany
  saveCompany(data: any) {
    return this.http.post(this.baseUrl + `master/iot-companies/save`, data);
  }
  // PUT
  // /master/iot-companies/update/{id}
  // Update existing IotCompany with Id
  updateCompanyById(id: any, data: any) {
    return this.http.put(
      this.baseUrl + `master/iot-companies/update/${id}`,
      data,
    );
  }
  //   GET
  // /master/iot-companies/getAllActiveCompanies
  // Get All Active Company Details
  getActiveIotCompanies() {
    return this.http.get(
      this.baseUrl + 'master/iot-companies/getAllActiveCompanies',
    );
  }
}
