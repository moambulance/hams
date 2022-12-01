import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  baseUrl: any = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  getCustomer() {
    return this.http.get(this.baseUrl + 'customer/all');
  }

  createCusomer(fd: any) {
    return this.http.post(this.baseUrl + 'customer/save', fd);
  }

  getCustomerById(id: any) {
    return this.http.get(this.baseUrl + 'customer/getById/' + id);
  }

  updateCustomer(id: any, fd: any) {
    return this.http.put(this.baseUrl + 'customer/update/' + id, fd);
  }
  //   GET
  // /customer/getByPhone/{phone}
  // Get Customer By Phone
  getByPhone(phoneNo: any) {
    return this.http.get(this.baseUrl + 'customer/getByPhone/' + phoneNo);
  }
}
