import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';
import { ManageMenuService } from '../manage-menu/manage-menu.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1',
        display: 'block',
        transform: 'translate3d(0, 0, 0)'
      })),
      state('closed', style({
        opacity: '0',
        display: 'none',
        transform: 'translate3d(0, -100%, 0)'
      })),
      transition('closed => open', animate('200ms ease-in')),
      transition('open => closed', animate('800ms ease-out'))
    ])
  ]
})
export class ManageUsersComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Manage Users',
    routing: [
      {
        routerHeading: 'Manage Users',
        routerLink: '/admin/settings/manage-users',
      },
    ],
  };
  userForm: any;
  buttonType: string = '';
  submitted = false;
  users: Array<any> = [];
  collapse: string = 'closed';
  activeEditMenuIndex: number = 0;
  activeUser: any = {};
  @ViewChild('openManageAccessModal') openManageAccessModal!: ElementRef;
  @ViewChild('closeManageAccessModal') closeManageAccessModal!: ElementRef;
  menuList: Array<any> = [];
  originalMenuList: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private adminService: AdminService,
    private menuService: ManageMenuService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      role: [1, [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      is_active: [true, []]
    });
  }

  ngOnInit(): void {
    this.showSpinner();
    this.buttonType = 'Create';
    this.getAllUsers();
  }

  getAllUsers() {
    this.adminService.getAllAdmins().subscribe((response: any) => {
      this.users = response.map((r: any) => {
        return { ...r, isActive: r.is_active == "1" ? true : false }
      });
      this.hideSpinner();
    });
  }

  openAddUserForm() {
    this.collapse = this.collapse == "open" ? 'closed' : 'open';
  }

  onEditClick(index:number) {
    this.collapse = "open";
    this.activeEditMenuIndex = index;
    this.document.getElementById("user-form")?.scrollIntoView({ behavior: 'smooth' });
    this.patchFormOnEdit();
    this.buttonType = "Save";
  }

  patchFormOnEdit() {
    const user = this.users[this.activeEditMenuIndex];
    console.log("user ", user);
    this.userForm.patchValue({
      name: user.name,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      is_active: user.is_active == 1 ? true : false,
      role: user.role
    });
  }

  saveUser() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    console.log("this.form.value ", this.f);

    let fd = {
      name: this.f.name.value,
      username: this.f.username.value,
      email: this.f.email.value,
      mobile: this.f.mobile.value,
      is_active: this.f.is_active.value ? '1' : '0',
      role: this.f.role.value,
      password: "moambulance123"
    };
    
    let id = 0;

    if (this.buttonType === "Save") {
      console.log("update form")
      id = this.users[this.activeEditMenuIndex].id;
    }

    this.adminService.saveAdmin(fd, id.toString(), this.buttonType).subscribe((response: any) => {
      if (response.success) {
        this.submitted = false;

        Swal.fire(response.message, '', 'success').then((result) => {
          if (result.isConfirmed) {
            this.showSpinner();
            if (this.buttonType === "Save") {
              this.buttonType = 'Create';
              this.collapse = 'closed';
            }
            this.resetUserAddForm();
            this.getAllUsers();
          }
        });
      } else {
        console.log("Error in save ", response);
        this.submitted = false;
        this.hideSpinner();
        Swal.fire("Error to save menu", '', 'error');
      }
    });
  }

  onUserStatusChange(event: any, index: number) {
    console.log("onStatusChange  ", this.users[index]);
    Swal
    .fire({ 
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`
    })
    .then((result) => {
      if (result.isConfirmed) {
        // update menu status;
        this.showSpinner();
        const updatedStatus = this.users[index].isActive ? "1" : "0";
        this.adminService
          .updateAdminStatus(this.users[index].id, {is_active: updatedStatus})
          .subscribe((response: any) => {
            console.log("response :: ", response);
            this.getAllUsers();
          });
      }
      else if (result.isDenied) {
        this.users[index].isActive = !this.users[index].isActive;
      }
    });
  }

  resetUserAddForm() {
    this.userForm.reset();
    this.f.is_active.setValue(true);
    this.f.role.setValue(1);
  }

  onCancel() {
    this.submitted = false;
    this.buttonType = 'Create';
    this.resetUserAddForm();
    this.getAllUsers();
    this.collapse = 'closed';
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  get f() { return this.userForm.controls; }

  async onManageRoleClick(index: number) {
    this.activeUser = this.users[index];
    this.openManageAccessModal.nativeElement.click();
    this.getAllActiveMenuList();
  }

  getAllActiveMenuList() {
    this.menuService.getAllActiveMenuListByType("1").subscribe((response: any) => { 
      this.adminService.getAdminRoleAndAccessByAdmin(this.activeUser.id).subscribe((accessResponse: any) => {
        const menuList = response.map((r: any) => {
          const item = accessResponse.filter((ar: any) => ar.menu_id == r.id)[0];
          console.log("item ", item);
          return {
            display_name: r.display_name,
            icon: r.icon,
            id: r.id,
            is_active: r.is_active == 1 ? true : false,
            name: r.name,
            readAccess: item?.read == 1 ? true : false,
            writeAccess: item?.write == 1 ? true : false,
            user_role_id: item?.id ? item?.id : null //This one is required for update case
          }
        });

        console.log(accessResponse);
        this.menuList = menuList;
        console.log("menulist :: ", this.menuList);
        // this.originalMenuList = JSON.parse(JSON.stringify(this.menuList));
      });
    })
  }

  onSaveRoleAccessChange() {
    console.log("onSaveRoleAccessChange  ", this.menuList, this.activeUser);
    const fd = this.menuList.map((menu) => {
      return {
        admin_id: this.activeUser.id,
        menu_id: menu.id,
        read: menu.readAccess ? 1 : 0,
        write: menu.writeAccess ? 1 : 0,
        is_active: 1, //default value,
        user_role_id: menu.user_role_id
      }
    });

   
    this.adminService.saveAdminRoleAndAccess(fd).subscribe((response: any) => {
      if(response.success) {
        Swal.fire(response.message, '', 'success').then((result) => {
          if (result.isConfirmed) {
            this.closeManageAccessModal.nativeElement.click();
          }
        });
      }else {
        console.log(response);
        Swal.fire("Error to save menu", '', 'error');
      }
    });
  }

  onCancelRoleAccessChange() {
    Swal
    .fire({ 
      title: 'All your changes will be discarded. Please confirm ?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Yes, Revert all changes!`,
      denyButtonText: `No, Stay Here`
    })
    .then((result) => {
      if (result.isConfirmed) {
        // update menu status;
        this.closeManageAccessModal.nativeElement.click();
      }
     /*  else if (result.isDenied) {
       
      } */
    });
    
  }
}
