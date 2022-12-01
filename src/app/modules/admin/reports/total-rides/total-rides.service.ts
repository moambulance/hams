import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TotalRidesService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  //   GET
  // /reports/getTotalRides/{type}/{startDate}/{endDate}
  // Total Rides Filter By Date
  getTotalRides(type: any, startDate: any, endDate: any) {
    return this.http.get(
      this.baseUrl + `reports/getTotalRides/${type}/${startDate}/${endDate}`,
    );
  }
}
