import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ManageMenuService } from 'src/app/modules/admin/manage-menu/manage-menu.service';
import { NavigationProperties } from 'src/app/utils/interfaces';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  /* features: Array<NavigationProperties> = [
    { id: 1, name: 'dashboard', displayLabel: 'Dashboard', icon: 'icon_style icon-home', routerLink: '/admin/dashboard' },
    { id: 2, name: 'live_ambulance', displayLabel: 'Live Ambulance', icon: 'icon_style fa-solid fa-location-crosshairs', routerLink: '/admin/live-ambulance' },
    { id: 3, name: 'book_an_ambulance', displayLabel: 'Book an Ambulance', icon: 'icon_style fa-solid fa-calendar-plus', routerLink: '/admin/book-ambulance' },
    { 
      id: 5, 
      name: 'iot',
      displayLabel: 'IOT',
      icon: 'icon_style fa-solid fa-calendar-plus', 
      children: [
        { 
          id: 1,
          name: 'medtel',
          displayLabel: 'Medtel',
          icon: 'icon_style fa-solid fa-calendar-plus',
          routerLink: '/admin/iot/medtel'
        }
      ] 
    },
    { 
      id: 6, 
      name: 'on_boarded_driver',
      displayLabel: 'On Boarded Driver',
      icon: 'icon_style icon-user-following',
      routerLink: '/admin/on-boarded'
    },
    { 
      id: 7, 
      name: 'on_boarded_hospital',
      displayLabel: 'On Boarded Hospital',
      icon: 'icon_style fa-solid fa-satellite-dish',
      routerLink: '/admin/on-boarded-hospital'
    },
    { 
      id: 8, 
      name: 'hospitals',
      displayLabel: 'Hospitals',
      icon: 'icon_style fa fa-h-square', 
      children: [
        { 
          id: 1,
          name: 'hospital_list',
          displayLabel: 'Hospital List',
          icon: 'icon_style fa-solid fa-hospital',
          routerLink: '/admin/hospitals'
        },
        { 
          id: 1,
          name: 'hospital_user',
          displayLabel: 'Hospital Users',
          icon: 'icon_style fa-solid fa-hospital-user',
          routerLink: '/admin/hospitals-user'
        },
        { 
          id: 1,
          name: 'kiosk',
          displayLabel: 'Kiosks',
          icon: 'icon_style fa-solid fa-hospital-user',
          routerLink: '/admin/kiosks'
        }
      ] 
    },
    { 
      id: 9, 
      name: 'ambulances',
      displayLabel: 'Ambulances',
      icon: 'icon_style fa fa-ambulance',
      routerLink: '/admin/ambulance'
    },
    { 
      id: 10, 
      name: 'customers',
      displayLabel: 'Customers',
      icon: 'icon_style fa fa-users',
      routerLink: '/admin/customers'
    },
    { 
      id: 11, 
      name: 'drivers',
      displayLabel: 'Drivers',
      icon: 'icon_style fa-solid fa-user-nurse',
      routerLink: '/admin/driver'
    },
    { 
      id: 12, 
      name: 'patients',
      displayLabel: 'Patients',
      icon: 'icon_style fa-solid fa-bed-pulse',
      routerLink: '/admin/patients'
    },
    { 
      id: 13, 
      name: 'orders',
      displayLabel: 'Orders',
      icon: 'icon_style fa-solid fa-truck-fast',
      routerLink: '/admin/orders'
    },
    { 
      id: 14, 
      name: 'master',
      displayLabel: 'Master',
      icon: 'icon_style fa-solid fa-border-all', 
      children: [
        { 
          id: 1,
          name: 'hospital_type',
          displayLabel: 'Hospital Type',
          icon: 'icon_style fa-solid fa-square-h',
          routerLink: '/admin/hospital-type'
        },
        { 
          id: 2,
          name: 'hospital_service',
          displayLabel: 'Hospital Service',
          icon: 'icon_style fa-solid fa-square-h',
          routerLink: '/admin/hospital-service'
        },
        { 
          id: 3,
          name: 'hospital_departments',
          displayLabel: 'Hospital Departments',
          icon: 'icon_style fa-solid fa-circle-h',
          routerLink: '/admin/hospital-departments'
        },
        { 
          id: 4,
          name: 'ambulance_type',
          displayLabel: 'Ambulance Type',
          icon: 'icon_style fa-solid fa-truck-medical',
          routerLink: '/admin/ambulance-type'
        },
        { 
          id: 5,
          name: 'medicines',
          displayLabel: 'Medicines',
          icon: 'icon_style fa-solid fa-capsules',
          routerLink: '/admin/medicines'
        },
        { 
          id: 6,
          name: 'test_type',
          displayLabel: 'Test Type',
          icon: 'icon_style fa-solid fa-vials',
          routerLink: '/admin/test-type'
        },
        { 
          id: 7,
          name: 'service_type',
          displayLabel: 'Service Type',
          icon: 'icon_style fa-solid fa-cart-plus',
          routerLink: '/admin/service-type'
        },
        { 
          id: 8,
          name: 'specialist_type',
          displayLabel: 'Specialist Type',
          icon: 'icon_style fa-solid fa-chalkboard-user',
          routerLink: '/admin/specialist-type'
        },
        { 
          id: 9,
          name: 'suffering',
          displayLabel: 'Suffering',
          icon: 'icon_style fa-solid fa-disease',
          routerLink: '/admin/suffering'
        },
        { 
          id: 10,
          name: 'advertise',
          displayLabel: 'Advertises',
          icon: 'icon_style fa-solid fa-rectangle-ad',
          routerLink: '/admin/advertise'
        },
        { 
          id: 11,
          name: 'iot_companies',
          displayLabel: 'IOT Companies',
          icon: 'icon_style fa-solid fa-building',
          routerLink: '/admin/iot-companies'
        },
        { 
          id: 12,
          name: 'mvitals_users',
          displayLabel: 'Mvitals Users',
          icon: 'icon_style fa-solid fa-bed-pulse',
          routerLink: '/admin/mvitals-user'
        }
      ] 
    },
    { 
      id: 15, 
      name: 'health_care_services',
      displayLabel: 'Health Care Services',
      icon: 'icon_style fa-solid fa-briefcase-medical', 
      children: [
        { 
          id: 1,
          name: 'medicine_delivery',
          displayLabel: 'Medicine Delivery',
          icon: 'icon_style icon-basket',
          routerLink: '/admin/medicine-delivery'
        },
        { 
          id: 2,
          name: 'home_care',
          displayLabel: 'Home Care',
          icon: 'icon_style fas fa-home',
          routerLink: '/admin/homecare'
        },
        { 
          id: 3,
          name: 'pathology',
          displayLabel: 'Pathology',
          icon: 'icon_style fa-solid fa-microscope',
          routerLink: '/admin/pathology'
        },
        { 
          id: 4,
          name: 'doctor_consultation',
          displayLabel: 'Doctor Consultation',
          icon: 'icon_style fa fa-user-md',
          routerLink: '/admin/doctor-consultation'
        }
      ] 
    },
    { 
      id: 16, 
      name: 'reports',
      displayLabel: 'Reports',
      icon: 'icon_style icon-bar-chart', 
      children: [
        { 
          id: 1,
          name: 'total_ambulances',
          displayLabel: 'Total Ambulances',
          icon: 'icon_style fas fa-car',
          routerLink: '/admin/total-ambulance'
        },
        { 
          id: 2,
          name: 'total_rides',
          displayLabel: 'Total Rides',
          icon: 'icon_style fas fa-car',
          routerLink: '/admin/total-rides'
        },
        { 
          id: 3,
          name: 'ambulance_rides',
          displayLabel: 'Ambulance Rides',
          icon: 'icon_style fas fa-car',
          routerLink: '/admin/ambulance-rides'
        },
        { 
          id: 4,
          name: 'driver_rides',
          displayLabel: 'Driver Rides',
          icon: 'icon_style fas fa-car',
          routerLink: '/admin/driver-rides'
        },
        { 
          id: 5,
          name: 'hospital_rides',
          displayLabel: 'Hospital Rides',
          icon: 'icon_style fas fa-car',
          routerLink: '/admin/hospital-rides'
        },
        { 
          id: 6,
          name: 'hospital_he_types',
          displayLabel: 'Hospital(He Types)',
          icon: 'icon_style fas fa-car',
          routerLink: '/admin/hospital-he-report'
        },
        { 
          id: 7,
          name: 'hospital_to_Hospital',
          displayLabel: 'Hospital to Hospital',
          icon: 'icon_style fas fa-car',
          routerLink: '/admin/hospital-to-hospital'
        }
      ] 
    },
    { 
      id: 17, 
      name: 'settings',
      displayLabel: 'Settings',
      icon: 'icon_style fa-solid fa-gear', 
      children:[
        { 
          id: 1,
          name: 'menu',
          displayLabel: 'Menu',
          icon: 'icon_style fa-solid fa-sliders',
          routerLink: '/admin/settings/menu'
        },
        { 
          id: 1,
          name: 'manage users',
          displayLabel: 'Manage Users',
          icon: 'icon_style fa-solid fa-users',
          routerLink: '/admin/settings/manage-users'
        }
      ]
    }
  ]; */

  features: Array<NavigationProperties> = [];

  constructor(private router: Router,
    private menuService: ManageMenuService,
    private adminService: AdminService,
    private authService: AuthService) {

    const user = this.authService.getRole();
    this.menuService.getAllActiveMenuList().subscribe((response: any) => {
      if (user.role == 2) { // only for admin check access. For super admin all are allowed.
        this.adminService.getAdminRoleAndAccessByAdmin(user.id).subscribe((userResponse: any) => { 
          this.processMenuAccess(response, userResponse);
        });
      } else {
        this.processMenuAccess(response);
      }
    });
  }

  processMenuAccess(data: any, userData?: any) {
    this.features = data.map((feature: any) => {
      let active = false;
      let children = [];
      let hasSubMenu = false;
      let read = false;
      let write = false;

      if(userData && userData.length > 0) {
        const item = userData.filter((ud: any) => ud.menu_id == feature.id)[0];
        read = item?.read == 1 ? true : false;
        write = item?.write == 1 ? true : false;
      }

      if (feature.is_submenu == 1) {
        hasSubMenu = true;
        let count = 0;
        children = feature.subMenu?.map((childrenFeature: any) => {
          if (this.router.url == childrenFeature.router_link) {
            count++;
          }

          return {
            id: childrenFeature.id,
            name: childrenFeature.name,
            displayLabel: childrenFeature.display_name,
            icon: childrenFeature.icon,
            routerLink: childrenFeature.router_link
          }
        });
        active = count > 0 ? true : false;
      } else {
        hasSubMenu = false;
        active = false;
        children = [];
      }

      return {
        id: feature.id,
        name: feature.name,
        routerLink: feature.router_link,
        icon: feature.icon,
        displayLabel: feature.display_name,
        hasSubMenu: hasSubMenu,
        active: active,
        children: children,
        read: read,
        write: write
      }
    });

    this.authService.saveMenuAccess(this.features);
  }


  staticData() {
    this.features = this.features.map(feature => {
      if (feature.children && feature.children.length > 0) {
        feature.hasSubMenu = true;
        let count = 0;
        feature.children?.map((childrenFeature) => {
          if (this.router.url == childrenFeature.routerLink) {
            count++;
          }
        });
        feature.active = count > 0 ? true : false;
      } else {
        feature.hasSubMenu = false;
        feature.active = false;
        feature.children = [];
      }
      return { ...feature };
    });
    console.log('features ', this.features);
  }

  ngOnInit(): void {
    // console.log("ngOnInit >> router url", this.router.url);
  }

  updateActiveState() {
    this.features = this.features.map((feature, i) => {
      if (feature.hasSubMenu) {
        feature.active = false;
      }
      return { ...feature }
    })
  }

}
