import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AmbulanceService } from '../ambulance/ambulance.service';
import { HospitalService } from './hospital.service';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';
import { colors } from '../shared/utils/colors';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.css'],
})
export class HospitalsComponent implements OnInit {
  hospitals: any;
  bedId: number = 0;
  hospitalsLength: any;
  is_checked: number = 0;
  approved: any;
  baseUrl: string = environment.BASE_URL;
  // toggle variable
  hospitalBedForm!: FormGroup;
  searchText: any;
  page: number = 1;
  pageSize: number = 10;
  breadCrumbData: any;
  allAvailableAmbulance: any = [];
  // start variables Excel sheet Conversion
  @ViewChild('openModal') openModal!: ElementRef;
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Hospital List.xlsx';
  isVisible: boolean = false;
  hospital_id: number = 0;
  bedDetailsLength = 0;
  selectedAmb: any = [];

  // Hospital Report Chart Variable
  @ViewChild('reportModal') reportModal!: ElementRef;
  reportForm!: FormGroup;

  endDate: any;
  backgroundColor: any = [
    '#68A7AD',
    '#0AA1DD',
    '#006E7F',
    '#F8CB2E',
    '#E4AEC5',
    '#5534A5',
    '#4E944F',
  ];
  public hospitalRides: any = [
    { data: [], label: '', backgroundColor: '#68A7AD' },
  ];

  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  public barChartPlugins = [];
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
  startDate: any;
  message: boolean = false;
  ambulanceTypes: any;
  selectedAmbulanceType: number = -1;
  hospitalDetails: any;
  CURRENT_URL: any;
  ambulanceTypeRides: any = [];
  //End of Hospital Report Chart Variable
  constructor(
    private hospitalService: HospitalService,
    private router: Router,
    private ambulanceService: AmbulanceService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
  ) {
    this.reportForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      ambulance_type_id: ['', [Validators.required]],
    });
    this.reportForm.controls['ambulance_type_id'].setValue(-1);
    this.hospitalBedForm = this.formBuilder.group({
      emergency_bed: ['', [Validators.required]],
      icu_bed: ['', [Validators.required]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          ),
        ],
      ],
      nicu_bed: ['', [Validators.required]],
      dialysis_bed: ['', [Validators.required]],
      emergency_doctor: ['', [Validators.required]],
      is_active: [''],
    });
  }

  ngOnInit() {
    this.breadCrumbPath();
    this.CURRENT_URL = this.router.url;
    // this.hospitals.paginator = this.paginator;
    this.getAllHospitals();
    this.showSpinner();
    this.getAmbulanceType();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  // Get All Ambulance By Hospital
  getAmbuLanceByHospitalId(id: any) {
    this.hospital_id = id;
    this.ambulanceService
      .getActiveAmbulanceApproved()
      .subscribe((ambulance: any) => {
        // Get All Active Approved Ambulance By Hospital
        this.allAvailableAmbulance = ambulance.map((aData: any) => {
          let aId = aData.hospital_id ? aData.hospital_id.id : '';
          // console.log(aData);

          if (parseInt(aId) === this.hospital_id) {
            this.selecedAmbulance(aData);

            return {
              ...aData,
              selected: true,
            };
          } else {
            return {
              ...aData,
              selected: false,
            };
          }
        });
      });

    this.openModal.nativeElement.click();
  }
  selecedAmbulance(ambulance: any): any {
    ambulance.selected = !ambulance.selected;
    let aId = ambulance.hospital_id ? ambulance.hospital_id.id : 0;
    if (ambulance.selected) {
      let addElement: any = {
        id: ambulance.id,
        hospital_id: this.hospital_id,
      };
      this.filterAmbulanceArray(this.selectedAmb, addElement);
      this.selectedAmb.push(addElement);
    } else {
      let removeElement = { id: ambulance.id, hospital_id: this.hospital_id };
      this.filterAmbulanceArray(this.selectedAmb, removeElement);
      if (parseInt(aId)) {
        this.selectedAmb.push({
          id: ambulance.id,
          hospital_id: 0,
        });
      }
    }
  }
  filterAmbulanceArray(array: any, element: any) {
    this.selectedAmb = [];
    array.filter((el: any) => {
      if (el.id !== element.id) {
        this.selectedAmb.push(el);
      }
    });
  }
  updateAssignedHospital() {
    this.showSpinner();
    this.toaster.success('Ambulance assign updated successfully!!!');
    this.ambulanceService
      .updateAssignedHospital(this.selectedAmb)
      .subscribe((response: any) => {
        this.hospital_id = 0;
      });
  }

  getAllHospitals() {
    this.hospitalService.getAllHospital().subscribe((response: any) => {
      this.hospitalsLength = response?.length;

      this.hospitals = response
        .map((result: any, index: any) => {
          return {
            ...result,

            sl_no: index + 1,
          };
        })
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize,
        );
    });
  }

  // on update hospital status
  onStatusChange(e: any, id: any, is_active: any) {
    this.is_checked = is_active;

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        if (e.target.checked) {
          this.is_checked = 1;
        } else {
          this.is_checked = 0;
        }
        const save_inputs = {
          is_active: this.is_checked,
        };

        if (id !== 0) {
          this.hospitalService
            .updateHospitalStatus(id, save_inputs)
            .subscribe((response: any) => {
              this.getAllHospitals();
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        this.getAllHospitals();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  exportExcel(): void {
    this.isVisible = true;
    setTimeout(() => {
      /* pass here the table id */
      let element: HTMLElement = this.excelTable.nativeElement as HTMLElement;
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      XLSX.writeFile(wb, this.fileName);
      this.isVisible = false;
    });
  }
  // On update Approved hospital
  onApprovedChange(event: any, id: any, is_approved: any) {
    this.is_checked = is_approved;

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        if (event.target.checked) {
          this.is_checked = 1;
        } else {
          this.is_checked = 0;
        }
        const save_inputs = { is_approved: this.is_checked };

        if (id !== 0) {
          this.hospitalService
            .updateApproveHospital(id, save_inputs)
            .subscribe((response: any) => {
              Swal.fire('Saved!', '', 'success');
              this.getAllHospitals();
            });
        }
      } else if (result.isDenied) {
        this.getAllHospitals();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  getBedDetails(id: number) {
    this.hospitalBedForm.reset();
    this.is_checked = 0;

    this.hospital_id = id;
    this.hospitalService
      .getHospitalDetailsByHospitalId(this.hospital_id)
      .subscribe((response: any) => {
        if (response) {
          this.bedId = response?.id;
          this.bedDetailsLength = response?.length;
          this.is_checked = response?.is_active;
          this.hospitalBedForm.patchValue({
            emergency_bed: response?.emergency_bed,
            icu_bed: response?.icu_bed,
            nicu_bed: response?.nicu_bed,
            dialysis_bed: response?.dialysis_bed,
            emergency_doctor: response?.emergency_doctor,
            phone: response?.phone,
            is_active: response?.is_active,
          });
        }
      });
  }
  onSubmitBed() {
    let saveInputs: any;
    if (this.bedDetailsLength === 0) {
      saveInputs = {
        hospital_id: this.hospital_id,
        emergency_bed: this.hospitalBedForm.value['emergency_bed'],
        icu_bed: this.hospitalBedForm.value['icu_bed'],
        nicu_bed: this.hospitalBedForm.value['nicu_bed'],
        dialysis_bed: this.hospitalBedForm.value['dialysis_bed'],
        emergency_doctor: this.hospitalBedForm.value['emergency_doctor'],
        phone: this.hospitalBedForm.value['phone'],
        is_active: this.is_checked,
      };
      this.hospitalService
        .saveHospitalDetails(saveInputs)
        .subscribe((response: any) => {
          if (response.success) {
            this.hospital_id = 0;
            this.toaster.success(response.message);
          }
        });
    } else {
      saveInputs = {
        hospital_id: this.hospital_id,
        emergency_bed: this.hospitalBedForm.value['emergency_bed'],
        icu_bed: this.hospitalBedForm.value['icu_bed'],
        nicu_bed: this.hospitalBedForm.value['nicu_bed'],
        dialysis_bed: this.hospitalBedForm.value['dialysis_bed'],
        emergency_doctor: this.hospitalBedForm.value['emergency_doctor'],
        phone: this.hospitalBedForm.value['phone'],
        is_active: this.is_checked,
      };
      this.hospitalService
        .updateHospitalDetailsByHospitalId(this.bedId, saveInputs)
        .subscribe((response: any) => {
          this.hospital_id = 0;
          this.toaster.success(response.message);
          this.hospital_id = 0;
        });
    }
  }
  get emergency_bed() {
    return this.hospitalBedForm.get('emergency_bed');
  }
  get phone() {
    return this.hospitalBedForm.get('phone');
  }
  get icu_bed() {
    return this.hospitalBedForm.get('icu_bed');
  }
  get nicu_bed() {
    return this.hospitalBedForm.get('nicu_bed');
  }
  get dialysis_bed() {
    return this.hospitalBedForm.get('dialysis_bed');
  }
  get emergency_doctor() {
    return this.hospitalBedForm.get('emergency_doctor');
  }
  onBedActive(event: any) {
    if (event.target.checked) {
      this.is_checked = 1;
    }
    this.is_checked = 0;
  }
  onReportClick(hospital: any) {
    console.log('hospital', hospital);
    this.hospitalDetails = hospital;
    this.intialReports();
  }
  getAmbulanceType() {
    this.ambulanceService.getAllAmbulanceTypes().subscribe((response: any) => {
      this.ambulanceTypes = response.filter((res: any, index: any) => {
        if (res.is_active === 1) {
          // console.log('ambulanceTypes', res);

          this.ambulanceTypeRides.push({
            data: [],
            label: res.name,
            backgroundColor: colors[index],
          });

          return res;
        }
      });
    });
  }

  intialReports() {
    let date30 = moment().subtract(30, 'days').calendar();
    let month = date30.slice(0, 2);
    let day = date30.slice(3, 5);
    let year = date30.slice(6, 10);
    this.startDate = year + '-' + month + '-' + day;
    this.endDate = moment().format().slice(0, 10);
    this.reportForm.patchValue({
      start_date: this.startDate,
      end_date: this.endDate,
    });
    let element: HTMLElement = this.reportModal.nativeElement as HTMLElement;
    element.click();
    this.getReport(this.startDate, this.endDate);
  }
  getReport(startDate: any, endDate: any) {
    switch (true) {
      case (this.selectedAmbulanceType == 0):
        this.hospitalRides = this.ambulanceTypeRides;
        this.barChartLabels = [];
        this.hospitalService
          .getHospitalRides(
            this.hospitalDetails.id,
            this.selectedAmbulanceType,
            startDate,
            endDate,
          )
          .subscribe(
            (response: any) => {
              if (response.data.length > 0) {
                this.message = true;
                console.log(this.ambulanceTypeRides);

                this.hospitalRides = this.ambulanceTypeRides
                response.data.map((d: any) => {
                  console.log(d);

                  this.barChartLabels.push(d.Date.split('T')[0]);
                  this.hospitalRides.map((type: any, index: any) => {
                    if (d.name === type.label) {
                      this.hospitalRides[index].data.push(d.totalRides);
                    } else {
                      this.hospitalRides[index].data.push(0);
                    }


                  });
                });
              } else {
                this.message = false;
              }
            },
            (error: any) => {
              this.message = false;
              console.log('error', error);
            },
          );
        break;

      case (this.selectedAmbulanceType == 1):
        this.hospitalRides = [
          { data: [], label: 'ALS Rides', backgroundColor: '#01b2c6' },
        ];
        this.barChartLabels = [];

        this.hospitalService
          .getHospitalRides(
            this.hospitalDetails.id,
            this.selectedAmbulanceType,
            startDate,
            endDate,
          )
          .subscribe(
            (response: any) => {
              console.log('res', response);

              if (response.data.length > 0) {
                this.message = true;
                this.hospitalRides[0].data = response.data.map((d: any) => {
                  this.barChartLabels.push(d.Date.split('T')[0]);
                  return d.totalRides;
                });
              } else {
                this.message = false;
              }
            },
            (error: any) => {
              this.message = false;
              console.log('error', error);
            },
          );
        break;
      case (this.selectedAmbulanceType == 2):
        this.hospitalRides = [
          {
            data: [],
            label: 'BLS Rides',
            backgroundColor: '#01b2c6',
          },
        ];
        this.barChartLabels = [];

        this.hospitalService
          .getHospitalRides(
            this.hospitalDetails.id,
            this.selectedAmbulanceType,
            startDate,
            endDate,
          )
          .subscribe(
            (response: any) => {
              console.log('res', response);

              if (response.data.length > 0) {
                this.message = true;
                this.hospitalRides[0].data = response.data.map((d: any) => {
                  this.barChartLabels.push(d.Date.split('T')[0]);
                  return d.totalRides;
                });
              } else {
                this.message = false;
              }
            },
            (error: any) => {
              this.message = false;
              console.log('error', error);
            },
          );
        break;
      case (this.selectedAmbulanceType == 3):
        this.hospitalRides = [
          {
            data: [],
            label: 'Mortuary Rides',
            backgroundColor: '#01b2c6',
          },
        ];
        this.barChartLabels = [];

        this.hospitalService
          .getHospitalRides(
            this.hospitalDetails.id,
            this.selectedAmbulanceType,
            startDate,
            endDate,
          )
          .subscribe(
            (response: any) => {
              console.log('res', response);

              if (response.data.length > 0) {
                this.message = true;
                this.hospitalRides[0].data = response.data.map((d: any) => {
                  this.barChartLabels.push(d.Date.split('T')[0]);
                  return d.totalRides;
                });
              } else {
                this.message = false;
              }
            },
            (error: any) => {
              this.message = false;
              console.log('error', error);
            },
          );
        break;
      case (this.selectedAmbulanceType == 4):
        this.hospitalRides = [
          {
            data: [],
            label: 'Instant Rides',
            backgroundColor: '#01b2c6',
          },
        ];
        this.barChartLabels = [];

        this.hospitalService
          .getHospitalRides(
            this.hospitalDetails.id,
            this.selectedAmbulanceType,
            startDate,
            endDate,
          )
          .subscribe(
            (response: any) => {
              console.log('res', response);

              if (response.data.length > 0) {
                this.message = true;
                this.hospitalRides = [
                  { data: [], label: 'Instant Rides', backgroundColor: '#01b2c6' },
                ];
                this.barChartLabels = [];
                response.data.map((d: any) => {
                  this.barChartLabels.push(d.Date.split('T')[0]);
                  this.hospitalRides[0].data.push(d.totalRides)
                });
              } else {
                this.message = false;
              }
            },
            (error: any) => {
              this.message = false;
              console.log('error', error);
            },
          );
        break;

      default:
        console.log("default?>>", this.hospitalDetails.id,
          this.selectedAmbulanceType,
          startDate,
          endDate,)

        this.barChartLabels = [];
        this.hospitalService
          .getHospitalRides(
            this.hospitalDetails.id,
            this.selectedAmbulanceType,
            startDate,
            endDate,
          )
          .subscribe(
            (response: any) => {
              console.log("default")
              console.log('res', response);

              if (response.data.length > 0) {
                this.message = true;
                this.hospitalRides = [
                  { data: [], label: 'Hospital Rides', backgroundColor: '#01b2c6' },
                ];
                this.barChartLabels = [];
                response.data.map((d: any) => {
                  this.barChartLabels.push(d.Date.split('T')[0]);
                  this.hospitalRides[0].data.push(d.totalRides)
                });
              } else {
                this.message = false;
              }
            },
            (error: any) => {
              this.message = false;
              console.log('error', error);
            },
          );
        break;
    }
  }


  onAmbulanceTypeChange(e: any) {
    console.log('eeeeeeeee', e.target.value);
    this.selectedAmbulanceType = e.target.value;
  }
  getFilteredData() {
    this.startDate = this.reportForm.value['start_date'];
    this.endDate = this.reportForm.value['end_date'];
    this.getReport(this.startDate, this.endDate);
  }
  get start_date() {
    return this.reportForm.get('start_date');
  }

  get end_date() {
    return this.reportForm.get('end_date');
  }

  get ambulance_type_id() {
    return this.reportForm.get('ambulance_type_id');
  }
  breadCrumbPath() {
    if (this.router.url === '/admin/hospitals') {
      this.breadCrumbData = {
        heading: 'Hospital List',
        routing: [
          { routerHeading: 'Hospitals', routerLink: '/admin/hospitals' },
        ],
      };
    } else if (this.router.url === '/admin/hospital-rides') {
      this.breadCrumbData = {
        heading: 'Hospital Rides',
        routing: [
          {
            routerHeading: 'Hospital Rides',
            routerLink: '/admin/hospital-rides',
          },
        ],
      };
    }
  }
}
