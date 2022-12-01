import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AmbulanceTypeService } from '../ambulance-type/ambulance-type.service';

@Component({
  selector: 'app-add-ambulance-type',
  templateUrl: './add-ambulance-type.component.html',
  styleUrls: ['./add-ambulance-type.component.css'],
})
export class AddAmbulanceTypeComponent implements OnInit {
  @ViewChild('profileImageFile') profileImage!: ElementRef;
  profileImageBrowse: any;
  addAmbulanceTypeForm: any;
  message: any;
  ambulanceTypeId: any;
  ambulanceTypeDetails: any;
  baseUrl: string = environment.BASE_URL;
  isImageChange: boolean = false;
  ambulanceTypeImage: any;
  breadCrumbData: any;
  routerUrl = '';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ambulanceTypeService: AmbulanceTypeService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.addAmbulanceTypeForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      base_fare: ['', [Validators.required]],
      slab1: ['', [Validators.required]],
      slab2: ['', [Validators.required]],
      oxygen: ['', [Validators.required]],
      ppe_kit: ['', [Validators.required]],
      status: [''],
      image: ['', [Validators.required]],
    });
    this.addAmbulanceTypeForm.controls['status'].setValue(-1);
  }

  ngOnInit(): void {
    this.showSpinner();
    this.routerUrl = this.router.url;
    this.breadCrumbDetails();
    console.log(this.profileImageBrowse);
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.ambulanceTypeId = Number(params.get('id'));
      this.ambulanceTypeService
        .getAmbulanceTypeById(this.ambulanceTypeId)
        .subscribe((response: any) => {
          this.ambulanceTypeDetails = response;
          this.updateAmbulanceTypeField(this.ambulanceTypeDetails);
          this.ambulanceTypeImage = response.image;
        });
    });
  }
  updateAmbulanceTypeField(ambulanceTypeDetails: any) {
    this.addAmbulanceTypeForm.patchValue({
      name: ambulanceTypeDetails.name,
      base_fare: ambulanceTypeDetails.basefare,
      slab1: ambulanceTypeDetails.per_km_charge_slab1,
      slab2: ambulanceTypeDetails.per_km_charge_slab2,
      oxygen: ambulanceTypeDetails.oxygen_per_km,
      ppe_kit: ambulanceTypeDetails.covid_ppe_cost,
    });
    this.addAmbulanceTypeForm.controls['status'].setValue(
      ambulanceTypeDetails.is_active,
    );
    this.profileImageBrowse = this.baseUrl + ambulanceTypeDetails.image;
  }

  onProfileImageChange(file: any) {
    if (this.ambulanceTypeId != '') {
      this.isImageChange = true;
    }
    if (file.target.files && file.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageBrowse = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);
    }
  }

  onAddAmbulanceType() {
    let fd = new FormData();
    fd.append('name', this.addAmbulanceTypeForm.value['name']);
    fd.append('basefare', this.addAmbulanceTypeForm.value['base_fare']);
    fd.append('per_km_charge_slab1', this.addAmbulanceTypeForm.value['slab1']);
    fd.append('per_km_charge_slab2', this.addAmbulanceTypeForm.value['slab2']);
    fd.append('oxygen_per_km', this.addAmbulanceTypeForm.value['oxygen']);
    fd.append('covid_ppe_cost', this.addAmbulanceTypeForm.value['ppe_kit']);
    fd.append('is_active', this.addAmbulanceTypeForm.value['status']);
    let file = this.profileImage.nativeElement.files[0];
    if (this.ambulanceTypeId) {
      fd.append(
        'image',
        this.isImageChange == true ? file : this.ambulanceTypeImage,
      );
    } else {
      fd.append('image', file != undefined ? file : '');
    }

    if (this.ambulanceTypeId) {
      this.ambulanceTypeService
        .updateAmbulanceTypeById(this.ambulanceTypeId, fd)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            setTimeout(() => {
              this.message = '';
              this.router.navigateByUrl('/admin/ambulance-type');
            }, 2000);
          }
        });
    } else {
      this.ambulanceTypeService
        .createAmbulanceType(fd)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            setTimeout(() => {
              this.message = '';
              this.router.navigateByUrl('/admin/ambulance-type');
            }, 2000);
          }
        });
    }
  }
  //  this.addAmbulanceTypeForm = this.formBuilder.group({
  //     name: ['', [Validators.required]],
  //     base_fare: ['', [Validators.required]],
  //     slab1: ['', [Validators.required]],
  //     slab2: ['', [Validators.required]],
  //     oxygen: ['', [Validators.required]],
  //     ppe_kit: ['', [Validators.required]],
  //     status: [''],
  //     image: [''],
  get name() {
    return this.addAmbulanceTypeForm.get('name');
  }
  get base_fare() {
    return this.addAmbulanceTypeForm.get('base_fare');
  }
  get slab1() {
    return this.addAmbulanceTypeForm.get('slab1');
  }
  get slab2() {
    return this.addAmbulanceTypeForm.get('slab2');
  }
  get oxygen() {
    return this.addAmbulanceTypeForm.get('oxygen');
  }
  get ppe_kit() {
    return this.addAmbulanceTypeForm.get('ppe_kit');
  }
  get status() {
    return this.addAmbulanceTypeForm.get('status');
  }
  get image() {
    return this.addAmbulanceTypeForm.get('image');
  }
  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  breadCrumbDetails() {
    if (this.routerUrl === '/admin/ambulance-type/add-ambulance-type') {
      this.breadCrumbData = {
        heading: 'Add Ambulance Type',
        routing: [
          {
            routerHeading: 'ambulance-type',
            routerLink: '/admin/ambulance-type',
          },
          {
            routerHeading: 'add-ambulance-type',
            routerLink: '/admin/ambulance-type/add-ambulance-type',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'edit Ambulance Type',
        routing: [
          {
            routerHeading: 'ambulance-type',
            routerLink: '/admin/ambulance-type',
          },
          {
            routerHeading: 'edit-ambulance-type',
            routerLink: '/admin/ambulance-type/edit-ambulance-type',
          },
        ],
      };
    }
  }
}
