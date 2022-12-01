import { environment } from "./../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class KioskService {
  baseUrl: string = environment.BASE_URL;
  private invoiceSubject = new BehaviorSubject<any>('');
  order: any

  constructor(private http: HttpClient) { }

  onInvoicePrint(order: any) {
    console.log('====================================');
    console.log(order);
    console.log('====================================');
    this.order = order
    this.invoiceSubject.next(order)
  }

  //   GET
  // /hospital/queue/allAmbulanceTypeAvailableByHospital/{hospital_id}/{typeId}
  // Get Ambulance list by hospital with on trip status

  getAmbulanceByTypeAndHospital(hospital_id: any, typeId: any) {
    return this.http.get(
      this.baseUrl +
      `hospital/queue/allAmbulanceTypeAvailableByHospital/${hospital_id}/${typeId}`
    );
  }
  //   // GET
  // /master/ambulance-type/all
  // List All Ambulance Types
  getAmbulanceTypes() {
    return this.http.get(this.baseUrl + "master/ambulance-type/all");
  }
  //   GET
  // /master/ambulance-type/allActive
  // List All Active Ambulance Types
  getActiveAmbulanceTypes() {
    return this.http.get(this.baseUrl + "master/ambulance-type/allActive");
  }

  //   POST
  // /hospital/queue/save
  // Add Queue
  SaveInQueue(data: any) {
    return this.http.post(this.baseUrl + "hospital/queue/save", data);
  }

  // GET
  // /hospital/queue/getByHospitalId/{hospital_id}
  // Get Queue Details By Hospital id
  getQueueByHospitalId(hospital_id: any) {
    return this.http.get(
      this.baseUrl + "hospital/queue/getByHospitalId/" + hospital_id
    );
  }

  // GET
  // /hospital/queue/getByAmbulanceId/{ambulance_id}
  // Get Queue Details By ambulance id

  getQueueDetailsByAmbulanceId(ambulance_id: any) {
    return this.http.get(
      this.baseUrl + "hospital/queue/getByAmbulanceId/" + ambulance_id
    );
  }

  // GET
  // /hospital/queue/allAmbulanceTypeAvailableByHospital/{hospital_id}/{typeId}
  // Get Ambulance list by hospital with on trip status

  getAmbulanceByhospitalWithTripStatus(hospital_id: any, typeId: any) {
    return this.http.get(
      this.baseUrl +
      `hospital/queue/allAmbulanceTypeAvailableByHospital/${hospital_id}/${typeId}`
    );
  }
  //   GET
  // /hospital/queue / findManagerQueueByHospitalId / { hospital_id }
  // Get Queue Manager Details By Hospital id

  findManagerQueueByHospitalId(hospital_id: any) {
    return this.http.get(
      this.baseUrl +
      "hospital/queue/findManagerQueueByHospitalId/" +
      hospital_id
    );
  }

  getAmbulanceByHospitalID(hospital_id: any) {
    return this.http.get(
      this.baseUrl +
      "hospital/queue/findAllAmbulanceByHospitalId/" +
      hospital_id
    );
  }

  //   PUT
  // /hospital/queue / updateOrder / { hospital_id } / { ambulance_id }
  // Update Queue Display Order By hospital_id and Ambulance Id
  updateQueueDisplayOrder(hospital_id: any, ambulance_id: any) {
    return this.http.get(
      this.baseUrl + `hospital/queue/updateOrder/${hospital_id}/${ambulance_id}`
    );
  }

  //   POST
  // /hospital/queue / saveQueueManager
  // Add Queue Manager
  saveQueueManager(data: any) {
    return this.http.post(
      this.baseUrl + `hospital/queue/saveQueueManager`,
      data
    );
  }
  //   GET
  // /hospital/queue / updateQueueStatus / { hospital_id } / { ambulance_id } / { status }
  // Update Queue Status
  updateQueueStatus(hospital_id: any, ambulance_id: any, status: any) {
    return this.http.get(
      this.baseUrl +
      `hospital/queue/updateQueueStatus/${hospital_id}/${ambulance_id}/${status}`
    );
  }
  //   GET
  // /hospital/queue / getAllQueueDriversByHospitalId / { hId }
  // List All Drivers By Hospital in Queue
  getAllQueueDriversByHospitalId(hospital_id: any) {
    return this.http.get(
      this.baseUrl +
      "hospital/queue/getAllQueueDriversByHospitalId/" +
      hospital_id
    );
  }
  //   GET
  // /hospital/queue / ongoingRideByHospitalId / { hospital_id }
  // Get ongoing Ride By Hospital Id
  ongoingRideByHospitalId(hospital_id: any) {
    return this.http.get(
      this.baseUrl +
      `hospital/queue/ongoingRideByHospitalId/${hospital_id}`
    );

  }
  ongoingOrdersByKiosks(hospital_id: number) {
    return this.http.get(
      `${this.baseUrl}orders/ongoingOrdersByKiosks/${hospital_id}`,
    );
  }
  //   GET
  // /orders/completeOrdersByKiosks / { hospital_id }
  // List All Orders By Hospital Id 
  completeOrdersByKiosks(hospital_id: number) {
    return this.http.get(
      `${this.baseUrl}orders/completeOrdersByKiosks/${hospital_id}`,
    );
  }
}
