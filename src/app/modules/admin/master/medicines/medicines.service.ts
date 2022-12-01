import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MedicinesService {
  baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   Medicines

  // GET
  // /master/medicine/all
  // List All Medicines
  getAllMedicine() {
    return this.http.get(this.baseUrl + 'master/medicine/all');
  }

  // GET
  // /master/medicine/getById/{id}
  // Get Medicine Details
  getMedicineById(id: any) {
    return this.http.get(this.baseUrl + 'master/medicine/getById/' + { id });
  }
  // POST
  // /master/medicine/save
  // Create Medicine
  saveMedicine(data: any) {
    return this.http.post(this.baseUrl + 'master/medicine/save', data);
  }
  // PUT
  // /master/medicine/update/{id}
  // Update Medicine
  updateMedicineById(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/medicine/update/' + id,
      data,
    );
  }
  // PUT
  // /master/medicine/updateStatus/{id}
  // Update Medicine Status
  updateMedicineStatus(id: any, data: any) {
    return this.http.put(
      this.baseUrl + 'master/medicine/updateStatus/' + id ,
      data,
    );
  }
}
