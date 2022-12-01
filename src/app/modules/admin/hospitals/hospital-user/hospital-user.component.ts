import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HospitalService } from '../hospital.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-hospital-user',
  templateUrl: './hospital-user.component.html',
  styleUrls: ['./hospital-user.component.css'],
})
export class HospitalUserComponent implements OnInit {
  hospitalUserForm: any;
  hospitalsList: any;
  message: any;
  searchText: any;
  page: number = 1;
  pageSize: number = 10;
  baseUrl: string = environment.BASE_URL;

  breadCrumbData: any = {
    heading: 'Hospital User',
    routing: [
      { routerHeading: 'hospitals user', routerLink: '/admin/hospitals-user' },
    ],
  };
  hospitalUsers: any;
  hospitalUsersLength: any;
  is_checked: any;
  buttonSave: string = 'Add';
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Ambulance List.xlsx';
  isVisible: boolean = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.hospitalUserForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      hospital_id: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
    this.hospitalUserForm.patchValue({ role: 0 });
  }

  ngOnInit(): void {
    this.showSpinner();
    this.getAllHospitalUsers();
    this.getAllHospitals();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  // Patch User

  getAllHospitals() {
    this.hospitalService.getAllHospital().subscribe((response: any) => {
      this.hospitalsList = response;
    });
  }
  getAllHospitalUsers() {
    this.hospitalService.getAllHospitalUsers().subscribe((response: any) => {
      console.log('users', response);
      this.hospitalUsersLength = response.length;

      this.hospitalUsers = response
        .map((result: any, index: any) => {
          return { ...result, sl_no: index + 1 };
        })
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize,
        );
    });
  }

  // User Active InActive Status
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
          console.log('>>', this.is_checked);
          this.is_checked = 1;
        } else {
          this.is_checked = 0;
        }
        const save_inputs = {
          is_active: this.is_checked,
        };

        if (id !== 0) {
          this.hospitalService
            .updateHospitalUserStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              this.getAllHospitalUsers();
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        this.getAllHospitalUsers();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  onRoleChange(id: any, role: any) {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        if (role === 1) {
          role = 2;
        } else {
          role = 1;
        }
        console.log('role', role);
        const save_inputs = {
          role: role,
        };

        if (id !== 0) {
          this.hospitalService
            .updateHospitalUserRole(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              this.getAllHospitalUsers();
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        this.getAllHospitalUsers();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  addHospitalUser() {
    const fd = {
      username: this.hospitalUserForm.value['username'],
      password: this.hospitalUserForm.value['password'],
      hospital_id: this.hospitalUserForm.value['hospital_id'],
      role: this.hospitalUserForm.value['role'],
      is_active: 1,
    };
    this.hospitalService.createHospitalUser(fd).subscribe((response: any) => {
      if (response.success) {
        this.message = response.message;
        setTimeout(() => {
          this.message = '';
          this.hospitalUserForm.reset();
        }, 2000);
      } else {
        this.message = response.message;
        setTimeout(() => {
          this.message = '';
          this.hospitalUserForm.reset();
        }, 2000);
      }
    });
  }

  get username() {
    return this.hospitalUserForm.get('username');
  }

  get password() {
    return this.hospitalUserForm.get('password');
  }

  get hospital_id() {
    return this.hospitalUserForm.get('hospital_id');
  }

  get role() {
    return this.hospitalUserForm.get('role');
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
