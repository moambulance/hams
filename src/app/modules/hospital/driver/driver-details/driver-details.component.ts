import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DriverService } from '../driver.service';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.css'],
})
export class DriverDetailsComponent implements OnInit {
  driverDetails: any;
  driverId: any;
  baseUrl: any = environment.BASE_URL;
  is_checked: any;
  breadCrumbData: any = {
    heading: 'Ambulance Details',
    routing: [
      {
        routerHeading: 'driver',
        routerLink: '/hospital/driver',
      },
      {
        routerHeading: 'ambulance-details',
        routerLink: '/hospital/driver/driver-details',
      },
    ],
  };
  constructor(
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.driverId = params.get('id');
    });

    this.getDriverDetails(this.driverId);
  }

  getDriverDetails(id: any) {
    this.driverService.getDriverById(id).subscribe((result: any) => {
      this.driverDetails = result;
      console.log(this.driverDetails);
    });
  }

  onStatusChange() {
    if ((this.is_checked = 1)) {
      this.is_checked = 0;
    } else {
      this.is_checked = 1;
    }
    // let driverData: any = this.driverForm.value;
    // console.log('<<<<<<', this.driverForm.value);
    // console.log('>>>>', this.dlSrc);
    // console.log('>>>>', this.is_checked);
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const save_inputs = new FormData();

        save_inputs.append('is_active', this.is_checked);

        if (this.driverId !== 0) {
          //add
          // save_inputs.append('id', this.driverId);
          this.driverService
            .updateDrivers(this.driverId, save_inputs)
            .subscribe((response: any) => {
              console.log(response);
              this.router.navigate(['hospital/driver-list']);
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
}
