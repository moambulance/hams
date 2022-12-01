import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MedicinesService } from './medicines.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.css'],
})
export class MedicinesComponent implements OnInit {
  medicineLength: any;
  medicineLists: any;
  searchText: any;
  page: number = 1;
  pageSize: number = 10;
  isBtnLoading = false;
  baseUrl: string = environment.BASE_URL;
  @ViewChild('excelTable') excelTable!: ElementRef;
  buttonSave: any = 'Add';
  @ViewChild('cancel') cancel!: ElementRef;
  @ViewChild('allList') allList!: ElementRef;

  fileName = 'Medicine List.xlsx';
  isVisible: boolean = false;

  breadCrumbData: any = {
    heading: 'Medicines List',
    routing: [
      {
        routerHeading: 'medicines',
        routerLink: '/admin/medicines',
      },
    ],
  };
  is_checked: any;
  medicineAddForm!: FormGroup;
  active: number = 1;
  prescribed: number = 0;
  message: any;
  medicine_id = 0;
  constructor(
    private medicineService: MedicinesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.medicineAddForm = this.formBuilder.group({
      medicine_name: ['', [Validators.required]],
      is_active: ['', [Validators.required]],
      is_prescription: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.showSpinner();
    this.getAllMedicines();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  onEdit(medicine: any) {
    this.buttonSave = 'Update';
    console.log('sfsdfdsf', medicine);
    this.active = medicine.is_active;
    this.prescribed = medicine.is_prescription;

    this.medicine_id = medicine.id;
    this.medicineAddForm.patchValue({
      medicine_name: medicine.name,
      is_active: medicine.is_active,
      is_prescription: medicine.is_prescription,
    });
  }

  getAllMedicines() {
    this.medicineService.getAllMedicine().subscribe((response: any) => {
      console.log('response', response);
      this.medicineLength = response.length;
      this.medicineLists = response
        .map((result: any, index: any) => {
          return { ...result, sl_no: index + 1 };
        })
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize,
        );
    });
  }
  onPrescribedChange(event: any, id: any, is_prescription: any) {
    console.log('id', id);
    this.is_checked = is_prescription;
    console.log('is_Active', is_prescription);
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
          // console.log('ddd', this.is_checked);
        }

        const save_inputs = {
          is_prescription: this.is_checked,
        };
        console.log(save_inputs);

        if (id !== 0) {
          //add
          console.log(id);
          this.medicineService
            .updateMedicineById(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllMedicines();
            });
        }
      } else if (result.isDenied) {
        this.getAllMedicines();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  onStatusChange(event: any, id: any, is_active: any) {
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
          // console.log('ddd', this.is_checked);
        }
        const save_inputs = {
          is_active: this.is_checked,
        };
        console.log(save_inputs);

        if (id !== 0) {
          //add
          // save_inputs.append('id', this.driverId);
          this.medicineService
            .updateMedicineStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllMedicines();
            });
        }
      } else if (result.isDenied) {
        this.getAllMedicines();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  exportExcel(): void {
    this.isVisible = true;
    let inputElement: HTMLElement = this.allList.nativeElement as HTMLElement;
    inputElement.click();

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

  onActiveChange(event: any) {
    console.log('>>', event.target.checked);

    if (event.target.checked) {
      return (this.active = 1);
    }
    return (this.active = 0);
  }
  onAddPrescribed(event: any) {
    console.log('>>', event.target.checked);
    if (event.target.checked) {
      return (this.prescribed = 1);
    }
    // console.log(">>",event.target.checked)
    return (this.prescribed = 0);
  }
  onAddMedicine() {
    let element: HTMLElement = this.cancel.nativeElement as HTMLElement;
    this.isBtnLoading = true;
    let saveInputs: any = {
      is_active: this.active,
      is_prescription: this.prescribed,

      name: this.medicineAddForm.value['medicine_name'],
    };
    console.log('bbb', saveInputs);
    if (this.medicine_id === 0) {
      this.medicineService
        .saveMedicine(saveInputs)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            this.getAllMedicines();
            setTimeout(() => {
              this.message = '';
              this.isBtnLoading = false;
              this.medicineAddForm.reset();

              element.click();
            }, 2000);
          }
        });
    } else {
      this.medicineService
        .updateMedicineById(this.medicine_id, saveInputs)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            this.getAllMedicines();
            setTimeout(() => {
              this.message = '';
              this.isBtnLoading = false;
              this.medicine_id = 0;
              this.buttonSave = 'Add';
              element.click();
            }, 2000);
          }
        });
    }
  }
  onCancel() {
    this.medicine_id = 0;
    this.buttonSave = 'Add';
    // this.router.navigate([this.router.url])
  }

  get medicine_name() {
    return this.medicineAddForm.get('medicine_name');
  }
}
