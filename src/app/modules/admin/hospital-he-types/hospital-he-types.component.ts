import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { HospitalService } from '../hospitals/hospital.service';
import { HospitalHeTypesService } from './hospital-he-types.service';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-hospital-he-types',
  templateUrl: './hospital-he-types.component.html',
  styleUrls: ['./hospital-he-types.component.css'],
})
export class HospitalHeTypesComponent implements OnInit, AfterViewInit {
  hospitalFormType: any;
  hospitalTypes: any;
  active: any;
  heType: any;
  heTypeId = 0;
  is_checked: any;
  message: any;
  buttonType: string = '';
  breadCrumbData: any = {
    heading: 'Hospital Type',
    routing: [
      { routerHeading: 'hospital-type', routerLink: '/admin/hospital-type' },
    ],
  };
  fileName = 'hospital hetypes.xlsx';
  isVisible: boolean = false;
  departmentLength: any;
  page: number = 1;
  pageSize: number = 10;
  cancelButton: string = '';
  @ViewChild('excelTable') excelTable!: ElementRef;
  searchText: any;
  writePermission: boolean = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private hospitalHeTypesService: HospitalHeTypesService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.hospitalFormType = this.formBuilder.group({
      hospital_type: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
    this.hospitalFormType.controls['status'].setValue(-1);

  }
  ngOnInit(): void {
    this.showSpinner();
    this.buttonType = 'Create';
    this.getHospitalType();
  }

  ngAfterViewInit(): void {
    this.getAccessData();
  }

  getAccessData() {
    setTimeout(() => { 
      this.writePermission = this.authService.getMenuAccessByCurrentURL(this.router.url);
      console.log("this.writePermission ", this.writePermission);

    }, 3000);
  }

  CreateHospitalType() {
    const fd = {
      name: this.hospitalFormType.value['hospital_type'],
      is_active: 1,
    };
    if (this.heTypeId === 0) {
      this.hospitalHeTypesService
        .createHeTypes(fd)
        .subscribe((response: any) => {
          if (response.success) {
            this.showSpinner();
            Swal.fire(response.message, '', 'success');
            setTimeout(() => {
              this.message = '';
              this.hospitalFormType.reset();
              this.hospitalFormType.controls['status'].setValue(-1);
              this.getHospitalType();
            }, 2000);
          }
        });
    } else {
      this.hospitalHeTypesService
        .updateHeTypes(this.heTypeId, fd)
        .subscribe((response: any) => {
          if (response.success) {
            this.showSpinner();
            Swal.fire(response.message, '', 'success');
            // console.log(response);
            // this.message = response.message;
            setTimeout(() => {
              this.message = '';
              this.hospitalFormType.reset();
              // this.hospitalFormType.controls['status'].setValue(-1);
              this.getHospitalType();
              this.buttonType = 'Create';
              this.heTypeId = 0;
              this.cancelButton = '';
            }, 2000);
          }
        });
    }
  }

  getHospitalType() {
    this.hospitalHeTypesService.getHeTypes().subscribe((response: any) => {
      this.departmentLength = response.length;
      this.hospitalTypes = response
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
    console.log('is_Active', is_active);
    console.log('checked', this.is_checked);

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
          this.hospitalHeTypesService
            .updateHeTypesStatusById(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');

              this.getHospitalType();
            });
        }
      } else if (result.isDenied) {
        this.getHospitalType();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  editHospitalType(id: any) {
    this.cancelButton = 'Cancel';

    this.hospitalHeTypesService
      .getHeTypesById(id)
      .subscribe((response: any) => {
        this.heType = response;
        this.heTypeId = response.id;
        this.buttonType = 'Update';
        this.hospitalFormType.patchValue({
          hospital_type: this.heType.name,
        });
        this.hospitalFormType.controls['status'].setValue(response.is_active);

        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
  }
  // get hospital_type() {
  //   return this.hospital_type.get('registration_date');
  // }
  onCancel() {
    this.heTypeId = 0;
    this.buttonType = 'Create';
    this.cancelButton = '';
    this.hospitalFormType.reset();
    this.getHospitalType();
  }
  get hospital_type() {
    return this.hospitalFormType.get('hospital_type');
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
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
    }, 1000);
  }
}
