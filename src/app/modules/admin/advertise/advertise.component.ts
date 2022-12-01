import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AdvertiseService } from './advertise.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-advertise',
  templateUrl: './advertise.component.html',
  styleUrls: ['./advertise.component.css'],
})
export class AdvertiseComponent implements OnInit {
  searchText!: string;
  advertiseLists: any;
  is_checked: any;
  fileName = 'advertise.xlsx';
  @ViewChild('excelTable') excelTable!: ElementRef;

  isVisible: boolean = false;
  baseUrl: string = environment.BASE_URL;
  breadCrumbData: any = {
    heading: 'Advertisement',
    routing: [
      {
        routerHeading: 'advertise',
        routerLink: '/admin/advertise',
      },
    ],
  };

  constructor(
    private advertiseService: AdvertiseService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.getAllAdevrtises();
    this.showSpinner();
  }

  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  getAllAdevrtises() {
    this.advertiseService.getAdvertise().subscribe((response: any) => {
      this.advertiseLists = response;
      console.log('response', response);
    });
  }

  onStatusChange(id: any) {
    console.log(id);

    this.advertiseService.getAdvertiseById(id).subscribe((response: any) => {
      this.is_checked = response.is_active;
      console.log('issss', this.is_checked);
    });
    // let driverData: any = this.driverForm.value;
    // console.log('<<<<<<', this.driverForm.value);
    // console.log('>>>>', this.dlSrc);
    // console.log('>>>>', this.is_checked);
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        if (this.is_checked === 1) {
          this.is_checked = 0;
        } else {
          this.is_checked = 1;
          console.log('ddd', this.is_checked);
        }
        const save_inputs = {
          is_active: this.is_checked,
        };
        if (id !== 0) {
          this.advertiseService
            .updateStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              this.getAllAdevrtises();
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        this.getAllAdevrtises();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  exportExcel(): void {
    this.isVisible = true;

    setTimeout(() => {
      /* pass here the table id */
      let element: HTMLElement = this.excelTable.nativeElement as HTMLElement;

      // let inputElement2: HTMLElement = document.getElementById(
      //   'allList',
      // ) as HTMLElement;
      // inputElement2.click();
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
