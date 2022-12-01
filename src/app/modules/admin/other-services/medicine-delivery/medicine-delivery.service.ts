import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedicineDeliveryService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   Medicine Delivery

  // GET
  // /medicine-delivery/all
  // List All Medicine Deliveries
  getAllMedicineDelivery() {
    return this.http.get(this.baseUrl + 'medicine-delivery/all');
  }

  // GET
  // /medicine-delivery/getById/{id}
  // Get Medicine Delivery Details
  getAllMedicineDeliveryById(id: any) {
    return this.http.get(this.baseUrl + 'medicine-delivery/getById/' + id);
  }

  // POST
  // /medicine-delivery/save
  // Create Medicine Delivery

  saveAllMedicineDelivery(data: any) {
    return this.http.post(this.baseUrl + 'medicine-delivery/save', data);
  }
  // PUT
  // /medicine-delivery/update/{id}
  // Update Medicine Delivery
  updateMedicineDelivery(id: any, data: any) {
    return this.http.put(this.baseUrl + 'medicine-delivery/update/' + id, data);
  }
  // PUT
  // /medicine-delivery/updateStatus/{id}
  // Update Medicine Delivery Status
  updateMedicineDeliveryStatusById(id: any, data: any) {
    return this.http.put(this.baseUrl + 'medicine-delivery/update/' + id, data);
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
