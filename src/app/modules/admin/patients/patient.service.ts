import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  //   Patient
  // GET
  // /patient/all
  // List All Patients
  getAllPatients() {
    return this.http.get(this.baseUrl + 'patient/all');
  }

  // GET
  // /patient/getById/{id}
  // Get Patient By id
  getPatientById(id: any) {
    return this.http.get(this.baseUrl + 'patient/' + id);
  }
  // POST
  // /patient/save
  // Create Patient

  // PUT
  // /patient/update/{id}
  // Update Patient

  // PUT
  // /patient/updateStatus/{id}
  // Update Hospital Status

  // GET
  // /patient/getPatientByOrderId/{order_id}
  // get Patient By order id
  //   GET
  // /patient/patientDetails/{id}
  // Get Patient Details
  patientDetails(id: any) {
    return this.http.get(this.baseUrl + 'patient/patientDetails/' + id);
  }
}
