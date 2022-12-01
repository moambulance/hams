import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class KioskService {
  baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  getAllActiveApprovedHospital() {
    return this.http.get(this.baseUrl + "hospital/allActiveApproved");
  }

  getAllAmbulanceByHospitalId(hospital_id: any) {
    return this.http.get(
      this.baseUrl + `ambulance/allByHospital/` + hospital_id
    );
  }
  getDriverByAmbulanceId(id: any) {
    return this.http.get(this.baseUrl + "driver/getDriverByAmbulance/" + id);
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
  // /hospital/queue/findAllAmbulanceByHospitalId/{hospital_id}
  // Get Ambulance list By HospitalId

  getAmbulanceByHospitalID(hospital_id: any) {
    return this.http.get(
      this.baseUrl +
        "hospital/queue/findAllAmbulanceByHospitalId/" +
        hospital_id
    );
  }

  // PUT
  // /hospital/queue/updateOrder/{hospital_id}/{ambulance_id}
  // Update Queue Display Order By hospital_id and Ambulance Id
  updateQueueDisplayOrder(hospital_id: any, ambulance_id: any, data: any) {
    return this.http.put(
      this.baseUrl +
        `hospital/queue/updateOrder/${hospital_id}/${ambulance_id}`,
      data
    );
  }

  //   PUT
  // /hospital/queue/updateQueueStatus/{hospital_id}/{ambulance_id}/{status}
  // Update Queue Status

  updateQueueStatus(
    hospital_id: any,
    ambulance_id: any,
    status: any,
    data: any
  ) {
    return this.http.put(
      this.baseUrl +
        `hospital/queue/updateQueueStatus/${hospital_id}/${ambulance_id}/${status}`,
      data
    );
  }

  // POST
  // /hospital/queue/saveMultiple
  // Add Multiple Queue

  addMultipleAmbulanceInQueue(data: any) {
    return this.http.post("hospital/queue/saveMultiple", data);
  }
  //   GET
  // /hospital/queue/removeAmbulanceFromQueue/{queue_id}
  // Remove Ambulance From Queue
  removeAmbulanceFromQueue(queue_id: any) {
    return this.http.get(
      this.baseUrl + "hospital/queue/removeAmbulanceFromQueue/" + queue_id
    );
  }
}
