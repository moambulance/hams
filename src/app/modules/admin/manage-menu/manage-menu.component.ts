import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ManageMenuService } from './manage-menu.service';

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1',
        display: 'block',
        transform: 'translate3d(0, 0, 0)'
      })),
      state('closed',   style({
        opacity: '0',
        display: 'none',
        transform: 'translate3d(0, -100%, 0)'
      })),
      transition('closed => open', animate('200ms ease-in')),
      transition('open => closed', animate('800ms ease-out'))
    ])
  ]
})
export class ManageMenuComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Menu',
    routing: [
      {
        routerHeading: 'menu',
        routerLink: '/admin/settings/menu',
      },
    ],
  };
  menuForm: any;
  buttonType: string = '';
  submitted = false;
  menuList: Array<any> = [];
  collapse: string = 'closed';
  activeEditMenuIndex: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private menuService: ManageMenuService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.menuForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      displayLabel: ['', [Validators.required]],
      routerLink: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      is_active: [true, []],
      type: [1, [Validators.required]],
      is_submenu: [false, []],
      subMenus: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.showSpinner();
    this.buttonType = 'Create';
    this.getMenuList();
  }

  getMenuList() {
    this.menuService.getAllMenuList().subscribe((response: any) => {
      this.hideSpinner();
      this.menuList = response.map((r: any) => {
        r.subMenu = r.subMenu.map((sm: any) => {
          return {...sm, isActive: sm.is_active};
        });
        return { 
          ...r, 
          showSubMenu: false, 
          isActive: r.is_active == "1" ? true : false
        };
      });
      console.log("this.menuList ", this.menuList);
    });
  }

  openAddMenuForm() {
    this.collapse = this.collapse == "open" ? 'closed' : 'open';
  }

  OnAddSubmenuSelected(event: any) {
    if(this.f.is_submenu.value) {
      this.f.routerLink.setValue("");
      this.f.routerLink.setValidators([]);
      this.f.routerLink.updateValueAndValidity();
      this.addSubMenuField();
    } else {
      this.f.routerLink.setValidators([Validators.required]);
      this.f.routerLink.updateValueAndValidity();
      let controlSubMenus = <FormArray>this.menuForm.controls.subMenus;
      this.clearFormArray(controlSubMenus);
    }
  }

  onViewSubMenu(index: number) {
    this.menuList[index].showSubMenu = !this.menuList[index].showSubMenu;
  }

  onMenuStatusChange(event: any, index: number) {
    console.log("onMenuStatusChange  ", this.menuList[index]);
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
        const updatedStatus = this.menuList[index].isActive ? "1" : "0";
        this.menuService
          .updateMenuStatus({is_active: updatedStatus}, this.menuList[index].id)
          .subscribe((response: any) => {
            console.log("response :: ", response);
            this.getMenuList();
          });
      }
      else if (result.isDenied) {
        this.menuList[index].isActive = !this.menuList[index].isActive;
      }
    });
  }

  onSubMenuStatusChange(event: any, parentIndex: number, childIndex: number) {
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
        const updatedStatus = this.menuList[parentIndex]?.subMenu[childIndex].isActive ? "1" : "0";
        this.menuService
          .updateSubMenuStatus({is_active: updatedStatus}, this.menuList[parentIndex]?.subMenu[childIndex].id)
          .subscribe((response: any) => {
            console.log("response :: ", response);
            this.getMenuList();
          });
      }
      else if (result.isDenied) {
        this.menuList[parentIndex].subMenu[childIndex].isActive = !this.menuList[parentIndex].subMenu[childIndex].isActive;
      }
    });
  }

  onEditMenuClick(index:number) {
    this.collapse = "open";
    this.activeEditMenuIndex = index;
    this.document.getElementById("menu-form")?.scrollIntoView({ behavior: 'smooth' });
    this.patchFormOnEdit();
    this.buttonType = "Save";
  }

  patchFormOnEdit() {
    const menu = this.menuList[this.activeEditMenuIndex];
    console.log("menu ", menu);
    if(menu.is_submenu == 1) {
      this.f.routerLink.setValue("");
      this.f.routerLink.setValidators([]);
      this.f.routerLink.updateValueAndValidity();
    }
    this.menuForm.patchValue({
      name: menu.name,
      displayLabel: menu.display_name,
      routerLink: menu.router_link,
      icon: menu.icon,
      is_active: menu.is_active == 1 ? true : false,
      type: menu.type,
      is_submenu: menu.is_submenu == 1 ? true : false,
    });

    if(menu.is_submenu == 1) {
      menu.subMenu.map((sm: any) => this.addSubMenuField({
        name: sm.name, 
        displayLabel: sm.display_name,
        routerLink: sm.router_link,
        icon: sm.icon,
        is_active: sm.is_active
      }));
    }
  }

  saveMenu() {
    console.log("this.form.value ", this.f, this.menuForm);
    this.submitted = true;

    // stop here if form is invalid
    if (this.menuForm.invalid) {
        return;
    }
    let fd = {
      name: this.menuForm.value['name'],
      display_name: this.menuForm.value['displayLabel'],
      router_link: this.menuForm.value['routerLink'],
      icon: this.menuForm.value['icon'],
      is_active: this.menuForm.value['is_active'] ? '1' : '0',
      type: this.f["type"].value,
      is_submenu: this.f.is_submenu.value ? 1 : 0,
      subMenus: this.f.subMenus.value
    };
    let id = 0;

    if(this.buttonType === "Save") {
      console.log("update form")
      id = this.menuList[this.activeEditMenuIndex].id;
      fd.subMenus = fd.subMenus.map((sm: any, i: number) => {
        return {
          ...sm,
          id: this.menuList[this.activeEditMenuIndex].subMenu[i].id
        }
      });
    } 

    this.menuService.saveMenu(fd, id.toString(), this.buttonType).subscribe((response: any) => {
      if (response.success) {
        this.submitted = false;
        
        Swal.fire(response.message, '', 'success').then((result) => {
          if (result.isConfirmed) {
            this.showSpinner();
            if(this.buttonType === "Save") {
              this.buttonType = 'Create';
              this.collapse = 'closed';
            }
            this.resetMenuAddForm();
            this.getMenuList();
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

  resetMenuAddForm() {
    this.menuForm.reset();
    this.f.is_active.setValue(true);
    this.f.type.setValue(1);
    this.f.is_submenu.setValue(false);
    let controlSubMenus = <FormArray>this.menuForm.controls.subMenus;
    this.clearFormArray(controlSubMenus);
  }

  onCancel() {
    this.submitted = false;
    this.buttonType = 'Create';
    this.menuForm.reset();
    this.getMenuList();
    this.collapse = 'closed';
    let controlSubMenus = <FormArray>this.menuForm.controls.subMenus;
    this.clearFormArray(controlSubMenus);
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  addSubMenuField(data?:any) {
    console.log("addSubMenuField ", data);
    const { name, displayLabel, routerLink, icon, is_active } = data || {
      name: "", 
      displayLabel: "",
      routerLink: "",
      icon: "",
      is_active: true
    };
    let control = <FormArray>this.menuForm.controls.subMenus;
    control.push(
      this.formBuilder.group({
        name: new FormControl(name, [Validators.required]),
        displayLabel: new FormControl(displayLabel, [Validators.required]),
        routerLink: new FormControl(routerLink, [Validators.required]),
        icon: new FormControl(icon, [Validators.required]),
        is_active: new FormControl(is_active, [Validators.required])
      })
    );
  }

  removeSubMenuField(index: number){
    let control = <FormArray>this.menuForm.controls.subMenus;
    control.removeAt(index);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  get f() { return this.menuForm.controls; }

  get subMenus(): FormArray {
	  return this.menuForm.get('subMenus') as FormArray;
  }
}
