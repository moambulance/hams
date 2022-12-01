import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) {}
  //   Orders

  // GET
  // /orders/all/{order_by}
  // List All Orders
  getAllOrders() {
    return this.http.get(this.baseUrl + 'orders/all/');
  }
  // GET
  // /orders/allExisting
  // List All Orders
  getAllExistingOrders(data: any) {
    return this.http.get(this.baseUrl + 'orders/allExisting/' + data);
  }

  //   GET
  // /orders/allOnTrip
  // List All on trip Orders
  getallOnTripOrders() {
    return this.http.get(this.baseUrl + 'orders/allOnTrip');
  }

  // GET
  // /orders/getByHospitalId/{hospital_id}/{order_by}
  // Get Order Details By Hospital id
  getallOrdersByHospitalId(hId: any, order_by: any) {
    return this.http.get(
      this.baseUrl + `orders/getByHospitalId/${hId}/${order_by}`,
    );
  }
  // GET
  // /orders/findAllByDestinationHospital/{destination_hospital_id}/{order_by}
  // Get Order Details By Destination Hospital id
  getAllByDestinationHospital(dHId: any, order_by: any) {
    return this.http.get(
      this.baseUrl + `orders/findAllByDestinationHospital/${dHId}/${order_by}`,
    );
  }
  // GET
  // /orders/findAllByDestinationHospitalAll/{destination_hospital_id}
  // Get Order Details By Destination Hospital id without order by filter
  getAllByDestinationHospitalAll(dHId: any) {
    return this.http.get(
      this.baseUrl + `/orders/findAllByDestinationHospitalAll/${dHId}`,
    );
  }
  // GET
  // /orders/getByPatientId/{patient_id}/{order_by}
  // Get Order Details By Patient id
  getByPatientId(pId: any, order_by: any) {
    return this.http.get(
      this.baseUrl + `orders/getByPatientId/${pId}/${order_by}`,
    );
  }
  // GET
  // /orders/getByCustomerId/{customer_id}/{order_by}
  // Get Orders By Customer id
  getByCustomerId(cId: any, order_by: any) {
    return this.http.get(
      this.baseUrl + `orders/getByCustomerId/${cId}/${order_by}`,
    );
  }
  // GET
  // /orders/getByDriverId/{driver_id}/{order_by}
  // Get Orders By Driver id
  getByDriverId(dId: any, order_by: any) {
    return this.http.get(
      this.baseUrl + `orders/getByDriverId/${dId}/${order_by}`,
    );
  }
  // GET
  // /orders/findOnTripByDriverId/{driver_id}/{order_by}
  // Get ontrip Order By Driver id
  getOnTripByDriverId(dId: any, order_by: any) {
    return this.http.get(
      this.baseUrl + `orders/findOnTripByDriverId/${dId}/${order_by}`,
    );
  }
  // GET
  // /orders/findOnTripByCustomerId/{customer_id}/{order_by}
  // Get ontrip Order By Customer id
  getOnTripByCustomerId(cId: any, order_by: any) {
    return this.http.get(
      this.baseUrl + `orders/findOnTripByCustomerId/${cId}/${order_by}`,
    );
  }
  // GET
  // /orders/findAllOnTripByCustomerId/{customer_id}
  // Get ontrip Order By Customer id
  getAllOnTripByCustomerId(cId: any) {
    return this.http.get(
      this.baseUrl + `orders/findAllOnTripByCustomerId/${cId}`,
    );
  }
  // GET
  // /orders/getById/{id}/{order_by}
  // Get Order Details
  getOrderById(id: any, order_by: any) {
    return this.http.get(this.baseUrl + `orders/getById/${id}/${order_by}`);
  }
  // POST
  // /orders/save
  // Create Order
  saveOrders(data: any) {
    return this.http.post(this.baseUrl + `orders/save`, data);
  }
  // PUT
  // /orders/update/{id}
  // Update Order
  updateOrders(id: any, data: any) {
    return this.http.put(this.baseUrl + `orders/update/${id}`, data);
  }
  // PUT
  // /orders/updateStatus/{id}
  // Update Ambulance Status
  updateOrderStatus(id: any, data: any) {
    return this.http.put(this.baseUrl + `orders/updateStatus/${id}`, data);
  }
  // PUT
  // /orders/updateExpiry/{id}
  // Update Order Expiry
  updateOrderExpiry(id: any, data: any) {
    return this.http.put(this.baseUrl + `orders/updateExpiry/${id}`, data);
  }
  // POST
  // /orders/confirmByDriver
  // Order Confirm By Driver
  saveConfirmByDriver(data: any) {
    return this.http.post(this.baseUrl + `orders/confirmByDriver`, data);
  }
  // POST
  // /orders/verifyOtpByDriver/{type}
  // Order Confirm By Driver (type: 1 - normal order, 2 - instant order)
  saveVerifyOtpByDriver(type: any, data: any) {
    return this.http.post(
      this.baseUrl + `orders/verifyOtpByDriver/${type}`,
      data,
    );
  }
  // POST
  // /orders/cancelOrder/{id}/{type}
  // Cancel Order by Customer / Driver, type: 1 - normal order, 2 - instant order
  cancelOrder(id: any, type: any, data: any) {
    return this.http.post(
      this.baseUrl + `orders/cancelOrder/${id}/${type}`,
      data,
    );
  }
  // POST
  // /orders/instantOrder
  // Create Instant Order by Customer
  saveInstantOrder(data: any) {
    return this.http.post(this.baseUrl + `orders/instantOrder`, data);
  }
  // PUT
  // /orders/endTrip/{id}
  // End Trip

  // POST
  // /orders/customerPaymentSuccess
  // customer Payment Success

  // POST
  // /orders/driverPaymentReceived
  // driver Payment Received

  // GET
  // /orders/allAmbulanceAvailableByHospital/{hospital_id}
  // Get Ambulance list by hospital with on trip status

  // GET
  // /orders/onTripCountByHospital/{hospital_id}
  // Get on Trip Count by hospital

  // POST
  // /orders/fareDetails
  // Get on Trip Fare DEtails

  // POST
  // /orders/saveTransaction
  // save transaction with fare details

  // GET
  // /orders/getHospitalFromLocation/{location}
  // get hospital details from google location data

  //  GET
  // /orders/generate-invoice/{order_id}
  // Generate Invoice
  generateInvoiceByOrderId(orderId: any) {
    return this.http.get(this.baseUrl + 'orders/generate-invoice/' + orderId);
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
  getCityByCityId(id: string) {
    return this.http.get(this.baseUrl + 'getCityByCityId/' + id);
  }
  getStateByStateId(id: any) {
    return this.http.get(this.baseUrl + 'getStateByStateId/' + id);
  }
  //   PUT
  // /orders/endTrip/{id}
  // End Trip
  updateTripStatus(id: any, data: any) {
    return this.http.put(`${this.baseUrl}orders/endTrip/${id}`, data);
  }
  //   PUT
  // /orders/closeTrip/{id}
  // Close Trip
  closeTrip(id: any, data: any) {
    return this.http.put(`${this.baseUrl}orders/closeTrip/${id}`, data);
  }
  //   GET
  // /orders/getAllPatientsByOrders/{id}
  // Get Patient Count
  getAllPatientCountByOrders(id: any) {
    return this.http.get(this.baseUrl + 'orders/getAllPatientsByOrders/' + id);
  }
  //   GET
  // /orders/findOrdersByAmbulance/{regdNo}
  // List All Orders By Ambulance
  findOrdersByAmbulance(regdNo: any) {
    return this.http.get(
      this.baseUrl + `orders/findOrdersByAmbulance/${regdNo}`,
    );
  }
  //   GET
  // /orders/findOrdersByDriverName/{name}
  // List All Orders By Driver Name
  findOrdersByDriverName(name: any) {
    return this.http.get(
      this.baseUrl + `orders/findOrdersByDriverName/${name}`,
    );
  }
  //   GET
  // /orders/findOrdersByDriverNumber/{number}
  // List All Orders By Driver Phone Number
  findOrdersByDriverNumber(number: any) {
    return this.http.get(
      this.baseUrl + `orders/findOrdersByDriverNumber/${number}`,
    );
  }
  // GET
  // /orders/getDriverRideDetailsById/{id}
  // Get Driver Ride Details By Id
  // List All Orders By Driver Phone Number
  getDriverOrderDetails(driver_id: any) {
    return this.http.get(
      this.baseUrl + `orders/getDriverRideDetailsById/${driver_id}`,
    );
  }
}
