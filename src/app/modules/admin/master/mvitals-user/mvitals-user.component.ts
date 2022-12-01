import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { AdminService } from '../../admin.service';
import { AmbulanceService } from '../../ambulance/ambulance.service';
import { MvitalsUserService } from './mvitals-user.service';

@Component({
  selector: 'app-mvitals-user',
  templateUrl: './mvitals-user.component.html',
  styleUrls: ['./mvitals-user.component.css'],
})
export class MvitalsUserComponent implements OnInit {
  baseUrl: string = environment.BASE_URL;
  breadCrumbData: any = {
    heading: 'Mvitals Users',
    routing: [
      {
        routerHeading: 'mvitals-user',
        routerLink: '/admin/mvitals-user',
      },
    ],
  };
  mvitalsUserAddForm: FormGroup;
  searchText: string = "";
  ambulances: Array<any> = [];
  message: string = "";
  ambulanceDropdownSettings: any = {};
  iotCompanyDropdownSettings: any = {};
  ShowFilter: boolean = true;
  iotCompanyShowFilter: boolean = true;
  selectedAmbulances: Array<any> = [];
  selectedIotCompanies: Array<any> = [];
  responseFalure: boolean = false;
  responseFalureIotCompany: boolean = false;
  mvitalusers: Array<any> = [];
  mvitalusersLength: number = 0;
  page: number = 1;
  pageSize: number = 10;
  filteredAmbulances: Array<any> = [];
  originalUserList: Array<any> = [];
  iotCompanies: Array<any> = [];
  
  @ViewChild('excelTable') excelTable!: ElementRef;
  @ViewChild('closeSideModal') closeSideModal!: ElementRef;
 
  constructor(
    private mvitalsUserService: MvitalsUserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private ambulanceService: AmbulanceService,
    private toaster: ToastrService,
    private adminService: AdminService
  ) {
    this.mvitalsUserAddForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      ambulance: ['', [Validators.required]],
      is_mhu: [false, []],
      iot_companies: ['', []]
    });
  }

  ngOnInit(): void {
    this.showSpinner();
    this.getAllAmbulance();
    this.getAllMvitalsUsers();
    this.getAllIotCompanies();
    this.ambulanceDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'registration_number',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      enableCheckAll: false,
      allowSearchFilter: this.ShowFilter,
    };
    this.iotCompanyDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      allowSearchFilter: this.iotCompanyShowFilter,
    };
  }

  onCreateMvitaluserClick() {
    this.filterAmbulanceList();
  }

  filterAmbulanceList() {
    this.filteredAmbulances = this.ambulances.filter((ambulance, index) => {
      const findIndex = this.originalUserList.findIndex((muser, j) => muser.ambulance_id?.id == ambulance.id);
      if(findIndex == -1) {
        return {
          ...ambulance
        }
      }
    });

  }

  getAllAmbulance() {
    this.ambulanceService.getActiveAmbulanceApproved().subscribe((response: any) => {
      this.ambulances = response;
    });
  }

  getAllIotCompanies() {
    this.adminService.getAllActiveIOTCompanies().subscribe((response: any) => {
      this.iotCompanies = response.data;
    });
  }

  getAllMvitalsUsers() {
    this.mvitalsUserService.getAllWithAmbulances().subscribe((response: any) => {
      this.mvitalusersLength = response.length;
      this.originalUserList = JSON.parse(JSON.stringify(response));
      this.mvitalusers = response
      .map((result: any, index: any) => {
          const iot_company = result?.iot_company_details.map((company: any) => {
            return company.name
          }).toString();
          return { ...result, sl_no: index + 1, iot_company: iot_company };
        })
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize,
        );
      this.hideSpinner();
    });
  }

  // User Active InActive Status
  onStatusChange(e: any, id: any, is_active: any) {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        const status = e.target.checked ? 1 : 0;
        const save_inputs = { is_active: status };

        if (id !== 0) {
          this.mvitalsUserService.updateHospitalUserStatus(id, save_inputs).subscribe((response: any) => {
              this.getAllMvitalsUsers();
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        this.getAllMvitalsUsers();
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  onAddMvitalsUser() {
    if(!this.mvitalsUserAddForm.valid) {
      this.message = "Please fill all required fileds"
      return;
    }
    const iotCompanies = this.mvitalsUserAddForm.value['iot_companies'].map((company: any) => { return company.id });
    const user = {
      username: this.mvitalsUserAddForm.value['username'],
      password: this.mvitalsUserAddForm.value['password'],
      ambulance_id: this.selectedAmbulances[0],
      is_mhu: this.mvitalsUserAddForm.value['is_mhu'] ? 1 : 0,
      iot_companies: iotCompanies.toString(),
      is_active: 1
    }

    this.mvitalsUserService.addMvital(user).subscribe((response: any) => {
      console.log(response);
      if (response.success) {
        this.toaster.success(response.message);
        this.message = response.message;
        this.getAllMvitalsUsers();
        setTimeout(() => {
          this.message = '';
          this.mvitalsUserAddForm.reset();
          this.closeSideModal.nativeElement.click();
        }, 2000);
      } else {
        console.log('response');
        this.responseFalure = true;
        this.responseFalureIotCompany = true;
      }
    });
  }

  onSelectAmbulance(item: any) {
    this.selectedAmbulances.push(item.id);
  }

  onDeSelect(item: any) {
    let index = this.selectedAmbulances.findIndex(
      (id: any) => id == item.ward_no,
    );
    this.selectedAmbulances.splice(index, 1);
    if (this.selectedAmbulances.length === 0) {
      this.getAllAmbulance();
    }
  }

  onSelectIotCompany(item: any) {
    this.selectedIotCompanies.push(item.id);
  }

  onDeSelectIotCompany(item: any) {
    let index = this.selectedIotCompanies.findIndex(
      (id: any) => id == item.ward_no,
    );
    this.selectedIotCompanies.splice(index, 1);
    if (this.selectedIotCompanies.length === 0) {
      this.getAllIotCompanies();
    }
  }

  get username() {
    return this.mvitalsUserAddForm.get('username');
  }

  get password() {
    return this.mvitalsUserAddForm.get('password');
  }

  get ambulance() {
    return this.mvitalsUserAddForm.get('ambulance');
  }
  
  get iot_companies() {
    return this.mvitalsUserAddForm.get('iot_companies');
  }
  
  get isMhu() {
    return this.mvitalsUserAddForm.get('is_mhu');
  }

  get FormValid() {
    return this.mvitalsUserAddForm.valid;
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }
}
