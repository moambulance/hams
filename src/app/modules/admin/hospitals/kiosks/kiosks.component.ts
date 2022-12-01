import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ReportService } from "../../reports/report.service";
import { KioskService } from "./kiosk.service";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

@Component({
  selector: "app-kiosks",
  templateUrl: "./kiosks.component.html",
  styleUrls: ["./kiosks.component.css"],
})
export class KiosksComponent implements OnInit {
  selectedHospital: any;
  hospitalList: any;
  hospitalId: number = 0;

  selectedDriver: any;
  driverList: any;
  driverId: number = 0;
  selectedAmbulance: any;
  ambulanceList: any;
  ambulanceId: number = 0;
  page: number = 1;
  pageSize: number = 25;
  page1: number = 1;
  pageSize1: number = 25;
  breadCrumbData: any = {
    heading: "Kiosks",
    routing: [
      {
        routerHeading: "kiosks",
        routerLink: "/admin/kiosks",
      },
    ],
  };
  ambulanceDropdownSettings: any = {};
  ShowFilter: boolean = true;
  allAmbulance: any = [];
  AmbulanceQueueArray: any = [];
  searchText: any;
  ambulanceLength: any;
  ambulanceQueue: any;
  ambulanceQueueLength: any;
  addedtoQueue: boolean = false;
  constructor(
    private kiosksService: KioskService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getHospitals();

    // this.getOrders();
    this.ambulanceDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      // itemsShowLimit: 3,
      enableCheckAll: false,
      allowSearchFilter: this.ShowFilter,
    };
    this.showSpinner();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 1000);
  }
  // Get All ACtive And Approved Hospital
  getHospitals() {
    this.kiosksService
      .getAllActiveApprovedHospital()
      .subscribe((response: any) => {
        this.hospitalList = response.map((rs: any) => {
          return {
            id: rs.id,
            name: rs.name.toUpperCase(),
          };
        });
      });
    this.getAmbulanceQueue();
  }
  // Get All Ambulances
  getAmbulances() {
    this.kiosksService
      .getAllAmbulanceByHospitalId(this.hospitalId)
      .subscribe((response: any) => {
        console.log("res", response);
        if (response.success === false) {
          this.toaster.warning("No ambulance Available");
        } else {
          this.showSpinner();
          this.ambulanceList = response;

          this.ambulanceList = response.map((res: any) => {
            return {
              id: res.id,
              name: `${res.registration_number.toUpperCase()} (${res.ambulance_type_id.name.toUpperCase()})`,
            };
          });
        }
      });
  }
  // .map((result: any, index: any) => {
  //           return { ...result, sl_no: index + 1 };
  //         })
  //         .slice(
  //           (this.page - 1) * this.pageSize,
  //           (this.page - 1) * this.pageSize + this.pageSize,
  //         );
  //     });
  getAmbulanceByHospitalID() {
    this.getAmbulanceQueue();
    this.kiosksService
      .getAmbulanceByHospitalID(this.hospitalId)
      .subscribe((response: any) => {
        console.log("response", response);
        this.ambulanceLength = response.length;
        if (response.length == 0) {
          this.allAmbulance = [];
          this.toaster.warning("No ambulance Available");
        } else {
          this.allAmbulance = response
            .map((result: any, index: any) => {
              return { ...result, sl_no: index + 1 };
            })
            .slice(
              (this.page - 1) * this.pageSize,
              (this.page - 1) * this.pageSize + this.pageSize
            );

          // .map((res: any) => {
          //   return {
          //     id: res.id,
          //     name: `${res?.registration_number.toUpperCase()} (${res.typeName.toUpperCase()})`,
          //   };
          // });
          // console.log("allAmbulance", this.allAmbulance);
        }
      });
  }

  //Add Ambulance To Queue
  addAmbulanceToQueue(hospital_id: any, ambulance_id: any, driverId: any) {
    const fd = {
      hospital_id: hospital_id,
      ambulance_id: ambulance_id,
      driver_id: driverId,
      is_active: 1,
    };
    this.kiosksService.SaveInQueue(fd).subscribe((response: any) => {
      if (response.success) {
        this.showSpinner();
        this.toaster.success("Added To Queue Successfully");
        this.getAmbulanceByHospitalID();
        this.addedtoQueue = true;
      } else {
        this.toaster.error("Please Try Again");
      }
    });
  }

  //Get Ambulance Queue by HospitalId
  getAmbulanceQueue() {
    this.kiosksService
      .getQueueByHospitalId(this.hospitalId)
      .subscribe((response: any) => {
        console.log("ambulanceQueue", response);
        this.ambulanceQueueLength = response.length;
        if (this.ambulanceQueueLength > 0) {
          this.addedtoQueue = true;
        } else {
          this.addedtoQueue = false;
        }
        this.ambulanceQueue = response
          .map((result: any, index: any) => {
            return { ...result, sl_no: index + 1 };
          })
          .slice(
            (this.page1 - 1) * this.pageSize1,
            (this.page1 - 1) * this.pageSize1 + this.pageSize1
          );
      });
  }
  // Get All Drivers
  getDrivers() {
    this.kiosksService
      .getDriverByAmbulanceId(this.ambulanceId)
      .subscribe((response: any) => {
        console.log(response);
        let data: any = [];

        if (response.success === false) {
          this.toaster.warning("No driver Available");
        } else {
          data.push(response);
          this.driverList = data.map((res: any) => {
            return { id: response.id, name: response.name.toUpperCase() };
          });
        }
      });
  }

  onHospitalSelect(event: any) {
    console.log("event", event);
    if (!event) {
      this.ambulanceQueue = [];
      this.allAmbulance = [];
    }

    this.hospitalId = event.id;
    console.log(event);

    this.getAmbulanceByHospitalID();
  }
  onAmbulanceSelect(event: any) {
    this.ambulanceId = event.id;
    this.getDrivers();
  }
  onDriverSelect(event: any) {
    this.driverId = event.id;
    console.log(event);
  }

  onSelectAmbulanceForQueue(item: any) {
    this.AmbulanceQueueArray.push(item.id);
  }
  onDeSelect(item: any) {
    let index = this.AmbulanceQueueArray.findIndex(
      (id: any) => id == item.ward_no
    );
    this.AmbulanceQueueArray.splice(index, 1);
    if (this.AmbulanceQueueArray.length === 0) {
      // this.surveyFilterForm.reset();
      // this.getHospitalType();
    }
  }
  removeAmbulanceToQueue(ambQueue: any) {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.kiosksService.removeAmbulanceFromQueue(ambQueue.id).subscribe(
          (res: any) => {
            console.log(res);

            if (res.success) {
              setTimeout(() => {
                this.getAmbulanceByHospitalID();
                this.toaster.success(
                  "Ambulance Removed From Queue Successfully"
                );
                console.log(res);
                this.spinner.hide();
              }, 2000);
            } else {
              this.toaster.error("Something Went Wrong Please Contact Support");
              this.spinner.hide();
            }
          },
          (error: any) => {
            this.toaster.error("Something Went Wrong Please Contact Support");
            console.log("error", error);

            this.spinner.hide();
          }
        );
      } else if (result.isDenied) {
        // this.manageOrders();
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
}
