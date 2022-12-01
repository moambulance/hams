import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvertiseService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  createAdvertise(fd: any){
    return this.http.post(this.baseUrl + "master/advertise/save", fd);
  }

  updateAdvertise(id: any, fd: any){
    return this.http.put(this.baseUrl + "master/advertise/update/" + id, fd);
  }

  getAdvertise(){
    return this.http.get(this.baseUrl + "master/advertise/all" );
  }

  getAdvertiseById(id: any){
    return this.http.get(this.baseUrl + "master/advertise/getById/" + id );
  }

  updateStatus(id: any, fd:any){
    return this.http.put(this.baseUrl + "master/advertise/updateStatus/" + id, fd );
  }
}
