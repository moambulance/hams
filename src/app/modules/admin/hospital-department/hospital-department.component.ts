import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { HospitalDepartmentService } from './hospital-department.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-hospital-department',
  templateUrl: './hospital-department.component.html',
  styleUrls: ['./hospital-department.component.css'],
})
export class HospitalDepartmentComponent implements OnInit {
  hospitalDepartmentForm: any;
  hospitalDepartments: any;
  active: any;
  hospitaldepartment: any;
  hospitalDepartmentId = 0;
  is_checked: any;
  message: any;
  buttonType: string = '';
  isVisible: boolean = false;
  fileName: any = 'hospital department List.xlsx';
  @ViewChild('excelTable') excelTable!: ElementRef;
  searchText: any;
  breadCrumbData: any = {
    heading: 'Hospital Department',
    routing: [
      {
        routerHeading: 'hospital-department',
        routerLink: '/admin/hospital-department',
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
    private hospitalDepartmentService: HospitalDepartmentService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.hospitalDepartmentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.showSpinner();
    this.buttonType = 'Create';
    this.getHospitalDepartments();
  }

  CreatehospitalDepartment() {
    const fd = {
      name: this.hospitalDepartmentForm.value['name'],
      is_active: 1,
    };
    if (!this.hospitalDepartmentId) {
      this.hospitalDepartmentService
        .createHospitalDepartments(fd)
        .subscribe((response: any) => {
          if (response.success) {
            this.showSpinner();
            Swal.fire(response.message, '', 'success');

            setTimeout(() => {
              this.message = '';
              this.hospitalDepartmentForm.reset();
              this.hospitalDepartmentForm.controls['is_active'].setValue(-1);
              this.getHospitalDepartments();
            }, 2000);
          }
        });
    } else {
      this.hospitalDepartmentService
        .updateHospitalDepartments(this.hospitalDepartmentId, fd)
        .subscribe((response: any) => {
          if (response.success) {
            this.showSpinner();
            Swal.fire(response.message, '', 'success');
            setTimeout(() => {
              this.hospitalDepartmentId = 0;
              this.buttonType = 'Create';
              this.cancelButton = '';
              // this.message = "";
              this.hospitalDepartmentForm.reset();
              this.getHospitalDepartments();
              this.buttonType = 'Create';
            }, 2000);
          }
        });
    }
  }

  getHospitalDepartments() {
    this.hospitalDepartmentService
      .getHospitalDepartments()
      .subscribe((response: any) => {
        this.departmentLength = response.length;
        this.hospitalDepartments = response
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
          this.hospitalDepartmentService
            .updateHospitalDepartmentsById(id, save_inputs)
            .subscribe((response: any) => {
              this.showSpinner();
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getHospitalDepartments();
            });
        }
      } else if (result.isDenied) {
        this.getHospitalDepartments();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  edithospitalDepartment(id: any) {
    window.scroll(0, 0);
    this.cancelButton = 'Cancel';
    this.hospitalDepartmentService
      .getHospitalDepartmentsByID(id)
      .subscribe((response: any) => {
        this.hospitaldepartment = response;
        this.hospitalDepartmentId = response.id;
        this.buttonType = 'Update';
        this.hospitalDepartmentForm.patchValue({
          name: this.hospitaldepartment.name,
        });
        this.hospitalDepartmentForm.controls['is_active'].setValue(
          response.is_active,
        );
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  onCancel() {
    this.hospitalDepartmentId = 0;
    this.buttonType = 'Create';
    this.cancelButton = '';
    this.hospitalDepartmentForm.reset();
    this.getHospitalDepartments();
  }
  get hospital_type() {
    return this.hospitalDepartmentForm.get('hospital_type');
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
}
