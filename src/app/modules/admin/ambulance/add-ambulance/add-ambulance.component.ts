import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HospitalService } from '../../hospitals/hospital.service';
import { AmbulanceService } from '../ambulance.service';

@Component({
  selector: 'app-add-ambulance',
  templateUrl: './add-ambulance.component.html',
  styleUrls: ['./add-ambulance.component.css'],
})
export class AddAmbulanceComponent implements OnInit {
  type: boolean = false;
  msg: any;
  ambulanceFrontSrc: any;
  ambulanceFrontUrl: any = '';
  ambulanceBackUrl: any = '';
  ambulanceBackSrc: any;
  ambulanceRightSrc: any;
  ambulanceRightUrl: any = '';
  ambulanceLeftSrc: any;
  ambulanceLeftUrl: any = '';
  ambulanceForm!: FormGroup;
  hospitals: any;
  ambulanceId: any = 0;
  baseUrl: any = environment.BASE_URL;
  ambulanceDetails: any;
  is_checked: any;
  ownerType: any;
  ambulanceType: any;
  ambulanceTypeId: any = '0';
  @ViewChild('frontImageFile') frontImage!: ElementRef;
  @ViewChild('backImageFile') backImage!: ElementRef;
  @ViewChild('rightImageFile') rightImage!: ElementRef;
  @ViewChild('leftImageFile') leftImage!: ElementRef;
  isImageChange: boolean = false;
  breadCrumbData: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ambulanceService: AmbulanceService,
    private hospitalService: HospitalService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.ambulanceForm = this.formBuilder.group({
      registration_date: ['', [Validators.required]],
      registration_number: ['', [Validators.required]],
      owner_type: ['', [Validators.required]],
      ambulance_type_id: ['', [Validators.required]],
      hospital_id: ['', [Validators.required]],
      is_active: [''],
      front_Image: [''],
      back_Image: [''],
      right_Side_Image: [''],
      left_Side_Image: [''],
    });
  }

  ngOnInit(): void {
    this.breadCrumbDetails();
    this.showSpinner();

    this.getAllHospital();

    this.getAmbulanceDetails();
    this.ambulanceService.getAllAmbulanceTypes().subscribe((response) => {
      this.ambulanceType = response;
    });
  }
  breadCrumbDetails() {
    if (this.router.url === '/admin/ambulance/add-ambulance') {
      this.breadCrumbData = {
        heading: 'Add Ambulance',
        routing: [
          {
            routerHeading: 'ambulance',
            routerLink: '/admin/ambulance',
          },
          {
            routerHeading: 'add-ambulance',
            routerLink: '/admin/ambulance/add-ambulance',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'Edit Ambulance',
        routing: [
          {
            routerHeading: 'ambulance',
            routerLink: '/admin/ambulance',
          },
          {
            routerHeading: 'edit-ambulance',
            routerLink: '/admin/ambulance/edit-ambulance',
          },
        ],
      };
    }
  }

  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000);
  }
  onClickType() {
    this.type = !this.type;
  }

  getAmbulanceDetails() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.ambulanceId = Number(params.get('id'));
      console.log('ambulanceId ', this.ambulanceId);
      if (this.ambulanceId != 0) {
        this.ambulanceService
          .getAmbulanceById(this.ambulanceId)
          .subscribe((response: any) => {
            console.log('>>>>>>>> ', response);
            console.log('owener', response.owner_type);
            this.ambulanceDetails = response;
            this.baseUrl = environment.BASE_URL;
            this.ambulanceForm.controls['ambulance_type_id'].setValue(
              response.ambulance_type_id ? response.ambulance_type_id.id : 0,
            );
            this.ambulanceForm.controls['hospital_id'].setValue(
              response.hospital_id ? response.hospital_id.id : 0,
            );
            // this.ambulanceTypeId = response.ambulance_type_id.ambulance_type_id;
            this.ambulanceFrontSrc = this.ambulanceDetails.front_image;
            this.ambulanceBackSrc = this.ambulanceDetails.back_image;
            this.ambulanceRightSrc = this.ambulanceDetails.right_side_image;
            this.ambulanceLeftSrc = this.ambulanceDetails.left_side_image;
            this.ambulanceFrontUrl = this.baseUrl + response.front_image;
            this.ambulanceBackUrl = this.baseUrl + response.back_image;
            this.ambulanceRightUrl = this.baseUrl + response.right_side_image;
            this.ambulanceLeftUrl = this.baseUrl + response.left_side_image;
            // this.box_checked = this.ambulanceDetails.is_active;
            console.log('this', this.ambulanceFrontSrc);
            console.log('--------------', this.ambulanceFrontUrl);

            this.ambulanceForm.patchValue({
              registration_date: this.ambulanceDetails.registration_date,
              registration_number: this.ambulanceDetails.registration_number,
              owner_type: this.ambulanceDetails.owner_type,
              is_active: this.ambulanceDetails.is_active,
            });
          });
      }
    });
  }

  onStatusChange() {
    if ((this.is_checked = 1)) {
      this.is_checked = 0;
    } else {
      this.is_checked = 1;
    }
  }
  onTypeChange(e: any) {
    console.log('event', e.target);
    this.ownerType = e.target.value;
  }
  box_checked: any;
  onChecked(event: any) {
    console.log('checked', event.target.value);
    this.box_checked = event.target.value;
  }

  onambulanceFrontUpload(image: any) {
    this.ambulanceFrontSrc = image.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image.target.files[0]);
    reader.onload = (_event) => {
      this.ambulanceFrontUrl = reader.result;
    };
  }
  onambulanceBackUpload(image: any) {
    console.log(image.target.files[0]);
    this.ambulanceBackSrc = image.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image.target.files[0]);
    reader.onload = (_event) => {
      this.ambulanceBackUrl = reader.result;
    };
  }
  onambulanceRightUpload(image: any) {
    console.log(image.target.files[0]);
    this.ambulanceRightSrc = image.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image.target.files[0]);
    reader.onload = (_event) => {
      this.ambulanceRightUrl = reader.result;
    };
  }
  onambulanceLeftUpload(image: any) {
    console.log(image.target.files[0]);
    this.ambulanceLeftSrc = image.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image.target.files[0]);
    reader.onload = (_event) => {
      this.ambulanceLeftUrl = reader.result;
    };
  }

  onSubmit() {
    let ambulanceData: any = this.ambulanceForm.value;
    console.log('<<<<<<', this.ambulanceForm.value);
    console.log('ambulanceData>>>>', ambulanceData);
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
        save_inputs.append(
          'registration_date',
          ambulanceData['registration_date'],
        );
        save_inputs.append(
          'registration_number',
          ambulanceData['registration_number'].toUpperCase(),
        );
        save_inputs.append(
          'owner_type',
          this.ambulanceForm.value['owner_type'],
        );
        save_inputs.append(
          'ambulance_type_id',
          ambulanceData['ambulance_type_id'],
        );
        let frontfile = this.frontImage.nativeElement.files[0];
        let back = this.frontImage.nativeElement.files[0];
        let rightFile = this.frontImage.nativeElement.files[0];
        let leftFile = this.frontImage.nativeElement.files[0];
        if (this.ambulanceTypeId) {
          save_inputs.append('front_image', this.ambulanceFrontSrc);
          save_inputs.append('back_image', this.ambulanceBackSrc);
          save_inputs.append('right_side_image', this.ambulanceRightSrc);
          save_inputs.append('left_side_image', this.ambulanceLeftSrc);
        } else {
          save_inputs.append(
            'front_image',
            frontfile != undefined ? frontfile : '',
          );
          save_inputs.append('back_image', back != undefined ? back : '');
          save_inputs.append(
            'right_side_image',
            rightFile != undefined ? rightFile : '',
          );
          save_inputs.append(
            'left_side_image',
            leftFile != undefined ? leftFile : '',
          );
        }
        save_inputs.append('hospital_id', ambulanceData['hospital_id']);
        save_inputs.append('is_active', '1');
        // save_inputs.append("front_image", this.ambulanceFrontSrc);
        // save_inputs.append("back_image", this.ambulanceBackSrc);
        // save_inputs.append("right_side_image", this.ambulanceRightSrc);
        // save_inputs.append("left_side_image", this.ambulanceLeftSrc);

        /*   if(driver.length > 0){
            driver.value.forEach((emp:any) => { save_inputs.append('document', emp); });
          } */
        if (this.ambulanceId == 0) {
          //add
          this.ambulanceService
            .addAmbulance(save_inputs)
            .subscribe((response: any) => {
              console.log(response);
              this.router.navigate(['admin/ambulance']);
              Swal.fire('Saved!', '', 'success');
            });
        } else {
          // save_inputs.append('id', this.driverId);
          this.ambulanceService
            .updateAmbulance(this.ambulanceId, save_inputs)
            .subscribe((response: any) => {
              console.log(response);
              this.router.navigate(['admin/ambulance']);
              Swal.fire('Saved!', '', 'success');
            });
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  getAllHospital() {
    this.hospitalService.getAllHospital().subscribe((response: any) => {
      this.hospitals = response;
      // console.log('hospitaals', response);
    });
  }

  get registration_date() {
    return this.ambulanceForm.get('registration_date');
  }
  get registration_number() {
    return this.ambulanceForm.get('registration_number');
  }
  get owner_type() {
    return this.ambulanceForm.get('owner_type');
  }
  get hospital_id() {
    return this.ambulanceForm.get('hospital_id');
  }

  get ambulance_type_id() {
    return this.ambulanceForm.get('ambulance_type_id');
  }
}
