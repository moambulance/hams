import { HttpClient } from '@angular/common/http';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DoctorConsultationService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   GET
  // /doctor-consultation/all
  // List All doctor consultation

  getAllDoctorConsultations() {
    return this.http.get(this.baseUrl + 'doctor-consultation/all');
  }
  // GET
  // /doctor-consultation/getById/{id}
  // Get DoctorConsultation Details
  getDoctorConsultationById(id: any) {
    return this.http.get(this.baseUrl + 'doctor-consultation/getById/' + id);
  }
  // POST
  // /doctor-consultation/save
  // Create DoctorConsultation
  saveDoctorConsultation(data: any) {
    return this.http.post(this.baseUrl + 'doctor-consultation/save', data);
  }
  // PUT
  // /doctor-consultation/update/{id}
  // Update Doctor Consultation
  updateDoctorConsultation(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'doctor-consultation/update/' + id,
      data,
    );
  }
  // PUT
  // /doctor-consultation/updateStatus/{id}
  // Update Doctor Consultation Status
  updateDoctorConsultationById(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'doctor-consultation/updateStatus/' + id,
      data,
    );
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
