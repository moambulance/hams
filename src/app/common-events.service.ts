import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonEventsService implements OnInit {
  sidebar: any = new EventEmitter();
  toggle!: boolean;
  isLoading!: boolean;
  sideBarToggle!: Observable<boolean>;
  baseUrl: string = environment.BASE_URL;
  private sideBarToggleSubject = new BehaviorSubject<boolean>(false);
  private spinnerCallSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.sideBarToggle = this.sideBarToggleSubject.asObservable();
  }
  ngOnInit(): void {
    this.toggle = false;
  }
  onSidebarToggle(message: boolean) {
    this.toggle = message;
    console.log(
      'Sidebar toggle Event Working',
      this.sideBarToggleSubject.next(message),
    );
    this.sideBarToggleSubject.next(message);
  }
  onSpinnerCall(message: boolean) {
    this.isLoading = message;
    console.log('spinnerCallSubject Working', this.isLoading);
    this.spinnerCallSubject.next(message);
  }

  getDashboardDetails() {
    return this.http.get(this.baseUrl + 'reports/getDashboardDetails');
  }
  //   GET
  // /orders/getAllPatientsByOrders/{id}
  // Get Patient Count
  getAllPatientCountByOrders(id: any) {
    return this.http.get(this.baseUrl + 'orders/getAllPatientsByOrders/' + id);
  }
}
