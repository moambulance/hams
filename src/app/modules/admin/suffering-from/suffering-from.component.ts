import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { SufferingFromService } from './suffering-from.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-suffering-from',
  templateUrl: './suffering-from.component.html',
  styleUrls: ['./suffering-from.component.css'],
})
export class SufferingFromComponent implements OnInit {
  sufferingList: any;
  sufferingForm: any;
  buttonType: string = '';
  message: any;
  sufferingId = 0;
  is_checked: any;
  suffering: any;
  page: number = 1;
  pageSize: number = 10;
  sufferingLength: any;
  breadCrumbData: any = {
    heading: 'Suffering',
    routing: [
      {
        routerHeading: 'suffering',
        routerLink: '/admin/suffering',
      },
    ],
  };
    @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Hospital Service List.xlsx';
  isVisible: boolean = false;
  cancelButton: string = '';
  constructor(
    private sufferingFromService: SufferingFromService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.sufferingForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // status: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.buttonType = 'Create';
    this.getAllSufferingList();
  }

  getAllSufferingList() {
    this.sufferingFromService.getSufferingFrom().subscribe((response: any) => {
      this.sufferingList = response;

      this.sufferingLength = response.length;
      this.sufferingList = response
        .map((result: any, index: any) => {
          return { ...result, sl_no: index + 1 };
        })
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize,
        );
    });
  }

  CreateSuffering() {
    const fd = {
      name: this.sufferingForm.value['name'],
      is_active: 1,
    };
    if (this.sufferingId === 0) {
      this.sufferingFromService
        .createSufferingFrom(fd)
        .subscribe((response: any) => {
          if (response.success) {
            Swal.fire(response.message, '', 'success');
            setTimeout(() => {
              // this.message = "";
              this.sufferingForm.reset();
              this.getAllSufferingList();
            }, 2000);
          }
        });
    } else {
      this.sufferingFromService
        .updateSufferingFrom(this.sufferingId, fd)
        .subscribe((response: any) => {
          if (response.success) {
            Swal.fire(response.message, '', 'success');
            this.sufferingId = 0;
            this.buttonType = 'Create';
            this.cancelButton = '';
            setTimeout(() => {
              this.message = '';
              this.sufferingForm.reset();
              this.getAllSufferingList();
              this.buttonType = 'Create';
            }, 2000);
          }
        });
    }
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
          this.sufferingFromService
            .updateStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Saved!', '', 'success');
              this.getAllSufferingList();
            });
        }
      } else if (result.isDenied) {
        this.getAllSufferingList();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  editSuffer(id: any) {
    this.cancelButton = 'Cancel';
    this.sufferingFromService
      .getSufferingFromById(id)
      .subscribe((response: any) => {
        this.suffering = response;
        this.sufferingId = response.id;
        this.buttonType = 'Update';
        this.sufferingForm.patchValue({
          name: this.suffering.name,
        });

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
    this.sufferingId = 0;
    this.cancelButton = '';
    this.buttonType = 'Create';
    this.sufferingForm.reset();
    this.getAllSufferingList();
  }
  get name() {
    return this.sufferingForm.get('name');
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
