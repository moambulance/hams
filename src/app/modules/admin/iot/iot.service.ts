import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MedtelData } from './iot.model';

@Injectable({
  providedIn: 'root',
})
export class IotService {
  baseUrl: string = environment.BASE_URL;
  medtelApi: string = environment.medtelApi;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    Authorization: `Bearer a3afc0c8a929baf26fc9d3d58da9854c`,
  });

  constructor(private http: HttpClient) {}
  // Medtel PAtient Registration
  // console.log(data);
  patientRegistraion(data: any) {
    return this.http.post(this.medtelApi, data);
  }
  patientSave(data: any) {
    return this.http.post(this.baseUrl, data);
  }
  patientUpdate(id: any, data: any) {
    return this.http.put(this.baseUrl + 'patient/update/' + id, data);
  }

  //  For testing php api
  getPhpData() {
    return this.http.get(
      'https://api.uniforms.expert/uniform-expert/prod-api/Products/productList',
    );
  }
  //   POST
  // /patient/medtelResponse/save
  // Save Medtel Response
  medtelResponseSave(data: any) {
    return this.http.post(this.baseUrl + 'patient/medtelResponse/save', data);
  }

  //   PUT
  // /patient/update/{id}
  // Update Patient

  // patientUpdate(id: any, data: any) {
  //   return this.http.put(this.baseUrl + 'patient/medtelResponse/save/'+id, data);
  // }
  //   GET
  // /patient/patientDetails/{id}
  // Get Patient Details
  patientDetails(id: any) {
    return this.http.get(this.baseUrl + 'patient/patientDetails/' + id);
  }

  getRazorpayDetailsById(id: string) {
    return this.http.get('https://api.razorpay.com/v1/payments/' + id);
  }

  //   GET
  // /master/pathology_test/getAllTest
  // Get All Available Test
  getAllTest() {
    return this.http.get(this.baseUrl + 'master/pathology_test/getAllTest/');
  }
  // GET
  // /master/pathology_test/getTestById/{id}
  // Get Available Test By Id
  getTestById(id: any) {
    return this.http.get(
      this.baseUrl + 'master/pathology_test/getTestById/' + id,
    );
  }
  // DELETE
  // /master/pathology_test/deleteTestById/{id}
  // Delete Available Test By Id
  deleteTestById(id: any) {
    return this.http.delete(
      this.baseUrl + 'master/pathology_test/deleteTestById/' + id,
    );
  }

  // POST
  // /master/pathology_test/save
  // Create New Test
  saveMedtelTest(data: any) {
    return this.http.post(this.baseUrl + 'master/pathology_test/save', data);
  }
  // PUT
  // /master/pathology_test/update/{id}
  // Update existing Test with Id
  updateMedtelTest(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/pathology_test/update/' + id,
      data,
    );
  }
  // PUT
  // /master/pathology_test/updateStatus/{id}
  // Update status of existing Test with Id
  updateStatus(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/pathology_test/updateStatus/' + id,
      data,
    );
  }
  // POST
  // /master/pathology_test/getTestFareDetail
  // Get Test FareDetail
  getFareDetails(data: any) {
    return this.http.post(
      this.baseUrl + 'master/pathology_test/getTestFareDetail',
      data,
    );
  }
  // POST
  // /master/pathology_test/saveFareDetails
  // Save Test FareDetail
  saveFareDetails(data: any) {
    return this.http.post(
      this.baseUrl + 'master/pathology_test/saveFareDetails',
      data,
    );
  }

  /* 
  GET
/master/pathology_test/getAllTestByCompanyId/{company_id}
Get All Available Test By Company Id */
  getAllTestByCompanyId(id: any) {
    return this.http.get(
      this.baseUrl + 'master/pathology_test/getAllTestByCompanyId/' + id,
    );
  }
}
