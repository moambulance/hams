import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { HospitalAvailableServicesService } from './hospital-available-services.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-hospital-available-services',
  templateUrl: './hospital-available-services.component.html',
  styleUrls: ['./hospital-available-services.component.css'],
})
export class HospitalAvailableServicesComponent implements OnInit {
  hospitalserviceForm: any;
  hospitalservices: any;
  active: any;
  hospitalService: any;
  hospitalServiceId = 0;
  is_checked: any;
  message: any;
  buttonType: string = '';
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Hospital Service List.xlsx';
  isVisible: boolean = false;
  searchText: any;
  breadCrumbData: any = {
    heading: 'Hospital Services',
    routing: [
      {
        routerHeading: 'hospital-service',
        routerLink: '/admin/hospital-service',
      },
    ],
  };
  departmentLength: any;
  page: number = 1;
  pageSize: number = 10;
  cancelButton: string = '';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private hospitalAvailableServicesService: HospitalAvailableServicesService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.hospitalserviceForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      is_active: ['', [Validators.required]],
    });
    // this.hospitalserviceForm.controls['is_active'].setValue(-1);
  }

  ngOnInit(): void {
    this.showSpinner();
    this.buttonType = 'Create';
    this.getHospitalService();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  CreateHospitalservice() {
    const fd = {
      name: this.hospitalserviceForm.value['name'],
      is_active: 1,
    };
    if (this.hospitalServiceId === 0) {
      this.hospitalAvailableServicesService
        .createHospitalAvailableServices(fd)
        .subscribe((response: any) => {
          console.log(response);
          if (response.success) {
            Swal.fire(response.message, '', 'success');
            this.showSpinner();
            setTimeout(() => {
              // this.message = "";
              this.hospitalserviceForm.reset();
              // this.hospitalserviceForm.controls['is_active'].setValue(-1);
              this.getHospitalService();
            }, 2000);
          }
        });
    } else {
      this.hospitalAvailableServicesService
        .updateHospitalAvailableServices(this.hospitalServiceId, fd)
        .subscribe((response: any) => {
          if (response.success) {
            Swal.fire(response.message, '', 'success');
            this.showSpinner();
            setTimeout(() => {
              this.message = '';
              this.hospitalserviceForm.reset();
              this.hospitalserviceForm.controls['is_active'].setValue(-1);
              this.getHospitalService();
              this.buttonType = 'Create';
              this.cancelButton = '';
              this.hospitalServiceId = 0;
            }, 2000);
          }
        });
    }
  }

  getHospitalService() {
    this.hospitalAvailableServicesService
      .getHospitalAvailableServices()
      .subscribe((response: any) => {
        this.departmentLength = response.length;
        this.hospitalservices = response
          .map((result: any, index: any) => {
            return { ...result, sl_no: index + 1 };
          })
          .slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
          );
      });
  }

  onStatusChange(event: any, id: any, is_active: any) {
    console.log(id);
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
        if (event.target.checked) {
          this.is_checked = 1;
          console.log('is', this.is_checked);
        } else {
          this.is_checked = 0;
        }
        const save_inputs = {
          is_active: this.is_checked,
        };
        console.log(save_inputs);

        if (id !== 0) {
          this.hospitalAvailableServicesService
            .updateHospitalAvailableServicesStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getHospitalService();
            });
        }
      } else if (result.isDenied) {
        this.getHospitalService();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  editHospitalservice(id: any) {
    this.cancelButton = 'Cancel';
    this.hospitalAvailableServicesService
      .getHospitalAvailableServicesById(id)
      .subscribe((response: any) => {
        this.hospitalService = response;
        this.hospitalServiceId = response.id;
        this.buttonType = 'Update';
        this.hospitalserviceForm.patchValue({
          name: this.hospitalService.name,
        });
        this.hospitalserviceForm.controls['is_active'].setValue(
          response.is_active,
        );
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
  }
  onCancel() {
    this.hospitalserviceForm.reset();
    this.hospitalServiceId = 0;
    this.cancelButton = '';
    this.getHospitalService();
    this.buttonType = 'Create';
  }
  get name() {
    return this.hospitalserviceForm.get('name');
  }
  exportExcel() {
    this.isVisible = true;
    setTimeout(() => {
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
}
