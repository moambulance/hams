import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { SpecialistTypeService } from './specialist-type.service';

@Component({
  selector: 'app-specialist-type',
  templateUrl: './specialist-type.component.html',
  styleUrls: ['./specialist-type.component.css'],
})
export class SpecialistTypeComponent implements OnInit {
  specialistTypeLength: any;
  specialistTypeLists: any;
  searchText: any;
  page: number = 1;
  pageSize: number = 10;
  isBtnLoading = false;
  baseUrl: string = environment.BASE_URL;
  @ViewChild('excelTable') excelTable!: ElementRef;
  buttonSave: any = 'Add';
  @ViewChild('cancel') cancel!: ElementRef;
  @ViewChild('allList') allList!: ElementRef;

  fileName = 'specialistType List.xlsx';
  isVisible: boolean = false;

  breadCrumbData: any = {
    heading: 'Specialist Type List',
    routing: [
      {
        routerHeading: 'specialist-type',
        routerLink: '/admin/specialist-type',
      },
    ],
  };
  is_checked: any;
  specialistTypeAddForm!: FormGroup;
  active: number = 1;
  prescribed: number = 0;
  message: any;
  specialistType_id = 0;
  constructor(
    private specialistTypeService: SpecialistTypeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.specialistTypeAddForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      is_active: ['', [Validators.required]],
      is_prescription: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.showSpinner();
    this.getAllSpecialistType();
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  onEdit(specialistType: any) {
    this.buttonSave = 'Update';
    console.log('sfsdfdsf', specialistType);
    this.active = specialistType.is_active;
    this.prescribed = specialistType.is_prescription;

    this.specialistType_id = specialistType.id;
    this.specialistTypeAddForm.patchValue({
      name: specialistType.name,
      is_active: specialistType.is_active,
      is_prescription: specialistType.is_prescription,
    });
  }

  getAllSpecialistType() {
    this.specialistTypeService
      .getAllSpecialistType()
      .subscribe((response: any) => {
        console.log('response', response);
        this.specialistTypeLength = response.length;
        this.specialistTypeLists = response
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
          this.specialistTypeService
            .updateSpecialistTypeById(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllSpecialistType();
            });
        }
      } else if (result.isDenied) {
        this.getAllSpecialistType();
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
          this.specialistTypeService
            .updateSpecialistTypeStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllSpecialistType();
            });
        }
      } else if (result.isDenied) {
        this.getAllSpecialistType();
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
  onAddSpecialistType() {
    let element: HTMLElement = this.cancel.nativeElement as HTMLElement;
    this.isBtnLoading = true;
    let saveInputs: any = {
      is_active: this.active,
      is_prescription: this.prescribed,

      name: this.specialistTypeAddForm.value['name'],
    };
    console.log('bbb', saveInputs);
    if (this.specialistType_id === 0) {
      this.specialistTypeService
        .saveSpecialistType(saveInputs)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            this.getAllSpecialistType();
            setTimeout(() => {
              this.message = '';
              this.isBtnLoading = false;
              this.specialistTypeAddForm.reset();

              element.click();
            }, 2000);
          }
        });
    } else {
      this.specialistTypeService
        .updateSpecialistTypeById(this.specialistType_id, saveInputs)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            this.getAllSpecialistType();
            setTimeout(() => {
              this.message = '';
              this.isBtnLoading = false;
              this.specialistType_id = 0;
              this.buttonSave = 'Add';
              element.click();
            }, 2000);
          }
        });
    }
  }
  onCancel() {
    this.specialistType_id = 0;
    this.buttonSave = 'Add';
    // this.router.navigate([this.router.url])
  }

  get name() {
    return this.specialistTypeAddForm.get('name');
  }
}
