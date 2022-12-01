import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MvitalsUserService {
  baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  addMvital(user: any) {
    return this.http.post(this.baseUrl + 'master/mvitals-user/createUser', user);
  }

  getAllMvitalUsers() {
    return this.http.get(this.baseUrl + 'master/mvitals-user/all');
  }
  
  getAllWithAmbulances() {
    return this.http.get(this.baseUrl + 'master/mvitals-user/findAllWithAmbulances');
  }

  updateHospitalUserStatus(id: any, data: any) {
    return this.http.put(this.baseUrl + 'master/mvitals-user/updateStatus/' + id, data);
  }

}
