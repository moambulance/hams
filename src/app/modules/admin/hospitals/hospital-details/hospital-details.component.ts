import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HospitalService } from '../hospital.service';

@Component({
  selector: 'app-hospital-details',
  templateUrl: './hospital-details.component.html',
  styleUrls: ['./hospital-details.component.css'],
})
export class HospitalDetailsComponent implements OnInit {
  hospitalDetails: any;
  hospitalId: any;
  baseUrl: any = environment.BASE_URL;
  is_checked: any;
  breadCrumbData: any = {
    heading: 'Hospital Details',
    routing: [
      {
        routerHeading: 'hospitals',
        routerLink: '/admin/hospitals',
      },
      {
        routerHeading: 'hospital-details',
        routerLink: '/admin/hospitals/hospital-details',
      },
    ],
  };
  constructor(
    private hospitalService: HospitalService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.hospitalId = params.get('id');
    });

    this.getHospitalDetails(this.hospitalId);
  }

  getHospitalDetails(id: any) {
    this.hospitalService.getHospitalById(id).subscribe((result: any) => {
      this.hospitalDetails = result;
      console.log(this.hospitalDetails);
    });
  }

  onStatusChange() {
    if ((this.is_checked = 1)) {
      this.is_checked = 0;
    } else {
      this.is_checked = 1;
    }
    // let hospitalData: any = this.hospitalForm.value;
    // console.log('<<<<<<', this.hospitalForm.value);
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

        if (this.hospitalId !== 0) {
          //add
          // save_inputs.append('id', this.hospitalId);
          this.hospitalService
            .updateHospital(this.hospitalId, save_inputs)
            .subscribe((response: any) => {
              console.log(response);
              this.router.navigate(['hospital/hospital-list']);
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
}
