import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) { }
  //     Admin


  getAllAdmins() {
    return this.http.get(this.baseUrl + 'admin/all/');
  }
  
  // POST
  // /admin/create
  // Create Admin
  saveAdmin(data: any, id?: string, type?: string) {
    const url = (type === "Save") ? `admin/update/${id}` : `admin/create`;
    const requestType = (type === "Save") ? 'put' : 'post';
    return this.http[requestType](this.baseUrl + url, data);
  }
  // PUT
  // /admin/update/{id}
  // Update Admin
  updateAdmin(id: any, updateData: any) {
    this.http.put(this.baseUrl + 'admin/update/' + id, updateData);
  }
  // POST
  // /admin/login
  // Admin Login
  loginAdmin(loginData: any) {
    return this.http.post(this.baseUrl + 'admin/login', loginData);
  }
  // PUT
  // /admin/updateStatus/{id}
  // Update Admin Status
  updateAdminStatus(id: any, statusData: any) {
    return this.http.put(
      this.baseUrl + 'admin/updateStatus/' + id,
      statusData,
    );
  }
  // POST
  // /admin/changePassword
  // Admin Change Password
  changeAdminPassword(passwordData: any) {
    return this.http.post(this.baseUrl + '/admin/changePassword', passwordData);
  }
  //   POST
  // /admin/changePassword
  // Admin Change Password
  changePassword(passwordData: any) {
    return this.http.post(`${this.baseUrl}admin/changePassword`, passwordData);
  }


  //  GET
  // /order/onTripAll
  // get all on trip orders
  allOnTrip() {
    return this.http.get(`${this.baseUrl}orders/allOnTrip`);
  }

  saveAdminRoleAndAccess(payload: any) {
    return this.http.post(`${this.baseUrl}admin/manage-role/save`, payload);
  }

  getAdminRoleAndAccessByAdmin(admin_id: string) {
    return this.http.get(`${this.baseUrl}admin/manage-role/findByAdminId/${admin_id}`);
  }
  
  getAllActiveIOTCompanies() {
    return this.http.get(`${this.baseUrl}master/iot-companies/getAllActiveCompanies`);
  }
}
