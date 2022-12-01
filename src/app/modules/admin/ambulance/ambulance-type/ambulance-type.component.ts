import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AmbulanceTypeService } from './ambulance-type.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ambulance-type',
  templateUrl: './ambulance-type.component.html',
  styleUrls: ['./ambulance-type.component.css'],
})
export class AmbulanceTypeComponent implements OnInit {
  ambulanceTypes: any;
  is_checked: any;
  baseUrl: string = environment.BASE_URL;
  breadCrumbData: any = {
    heading: 'Ambulance Types',
    routing: [
      {
        routerHeading: 'ambulance-types',
        routerLink: '/admin/ambulance-type',
      },
    ],
  };
  ambulanceLength: any;
  page: number = 1;
  pageSize: number = 10;
  @ViewChild('excelTable') excelTable!: ElementRef;
  fileName = 'Ambulance List.xlsx';
  isVisible: boolean = false;
  searchText: any;

  constructor(
    private ambulanceTypeService: AmbulanceTypeService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.showSpinner();
    this.getAllAmbulanceType();
  }

  getAllAmbulanceType() {
    this.ambulanceTypeService.getAmbulanceType().subscribe((response: any) => {
      this.ambulanceLength = response?.length;
      this.ambulanceTypes = response
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
      title: 'Do you want to update the status?',
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
          this.ambulanceTypeService
            .updateAmbulanceTypeStatus(id, save_inputs)
            .subscribe((response: any) => {
              console.log('tttt', response);
              Swal.fire('Status Updated', '', 'success');
              this.getAllAmbulanceType();
            });
        }
      } else if (result.isDenied) {
        this.getAllAmbulanceType();
        Swal.fire('Changes are not saved', '', 'info');
      }
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
