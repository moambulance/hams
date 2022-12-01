import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SufferingFromService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) {}



  createSufferingFrom(fd: any){
    return this.http.post(this.baseUrl + "master/suffering-from/save", fd);
  }

  updateSufferingFrom(id: any, fd: any){
    return this.http.put(this.baseUrl + "master/suffering-from/update/" + id, fd);
  }

  getSufferingFrom(){
    return this.http.get(this.baseUrl + "master/suffering-from/all" );
  }

  getSufferingFromById(id: any){
    return this.http.get(this.baseUrl + "master/suffering-from/getById/" + id );
  }

  updateStatus(id: any, fd:any){
    return this.http.put(this.baseUrl + "master/suffering-from/updateStatus/" + id, fd );
  }
}
