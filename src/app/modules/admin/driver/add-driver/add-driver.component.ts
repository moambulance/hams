import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AmbulanceService } from '../../ambulance/ambulance.service';
import { DriverService } from '../driver.service';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
})
export class AddDriverComponent implements OnInit {
  baseUrl: any = '';
  driverForm!: FormGroup;
  is_checked: any;
  adharFrontUrl: any = '';
  adharBackUrl: any = '';
  profileUrl: any = '';
  dlUrl: any = '';
  // allAmbulance: any;
  searchText: any;
  adharFrontSrc: any = '';
  adharBackSrc: any = '';
  dlSrc: any = '';
  profileSrc: any = '';
  driverId: any = 0;
  ShowFilter: boolean = true;
  driverDetails: any;
  isBtnLoading: boolean = false;
  breadCrumbData: any;
  ambulanceLength: any;
  userDetails: any;
  ambulanceAvailableServices: any;

  ambulanceTypeArray: any = [];
  ambulanceId: any;
  ambulanceDetails: any;
  ambulanceServiceDropdownSettings: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    enableCheckAll: false,
    allowSearchFilter: this.ShowFilter,
    unSelectAllText: 'UnSelect All',
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private ambulanceService: AmbulanceService,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    this.driverForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      adhar_no: ['', [Validators.required]],
      dl_no: ['', [Validators.required]],
      is_active: ['', [Validators.required]],
      profile_image: ['', [Validators.required]],
      adhar_front_image: ['', [Validators.required]],
      adhar_back_image: ['', [Validators.required]],
      dl_image: ['', [Validators.required]],
      ambulance_id: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getAllAmbulance();
    this.breadCrumbDetails();
    this.getDriverDetails();
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
  onSelectAmbulanceService(item: any) {
    console.log('item+-+', item);
    this.ambulanceId = item?.id;
  }
  onDeSelectAmbulanceService(item: any) {
    this.ambulanceId = '';
    console.log('item', this.ambulanceId);
  }
  getAllAmbulance() {
    this.ambulanceService.getAmbulance().subscribe((response: any) => {
      console.log('ambulanceService>>', response);
      this.ambulanceLength = response.length;
      // console.log('all ambulance', response);
      this.ambulanceAvailableServices = response.map((result: any, i: number) => {
        let ambulaceName: any;
        if (result.registration_number) {
          ambulaceName = result.registration_number;
        } else {
          ambulaceName = 'NA';
        }
        console.log(i, " result.ambulance_type_id.name ", result.ambulance_type_id?.name);
        return {
          id: result?.id,
          name: result.ambulance_type_id?.name + '-' + ambulaceName,
        };
      });
    });
  }
  getDriverDetails() {
    let ambulanceIds: any = [];
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.driverId = Number(params.get('id'));
      // console.log('driverId ', this.driverId);
      if (this.driverId != 0) {
        // this.getAllAmbulance();
        this.driverService
          .getDriverById(this.driverId)
          .subscribe((response: any) => {
            console.log('f>>>>>>>> ', response);
            this.ambulanceId = response?.ambulance_id;
            this.driverDetails = response;
            this.baseUrl = environment.BASE_URL;
            this.profileSrc = this.driverDetails.profile_image;
            this.adharFrontSrc = this.driverDetails.adhar_front_image;
            this.adharBackSrc = this.driverDetails.adhar_back_image;
            this.dlSrc = this.driverDetails.dl_image;
            this.is_checked = this.driverDetails.is_active;
            this.adharBackUrl =
              this.baseUrl + this.driverDetails.adhar_back_image;
            this.adharFrontUrl =
              this.baseUrl + this.driverDetails.adhar_front_image;
            this.profileUrl = this.baseUrl + this.driverDetails?.profile_image;
            this.dlUrl = this.baseUrl + this.driverDetails.dl_image;
            this.ambulanceAvailableServices?.map((res: any) => {
              // console.log('asa', res);
              // if (res.id === response?.ambulance_id) {
              //   console.log('ss', res);
              //   ambulanceIds.push(res);
              //   this.ambulanceDetails = res;
              //   this.onSelectAmbulanceService(res);
              // }
              console.log('ddd', res.id === response?.ambulance_id);
            });
            // console.log(
            //   'this.ambulanceDetails',
            //   this.ambulanceAvailableServices.findIndexOf(
            //     response.ambulance_id,
            //   ),
            // );
            this.ambulanceAvailableServices?.filter((mt: any) => {
              if (mt.id === response.ambulance_id) {
                console.log('mtttt', mt);
                console.log(' response.ambulance_id', response.ambulance_id);
                return ambulanceIds.push(mt);
              }
            }),
              this.driverForm.patchValue({
                name: this.driverDetails?.name,
                email: this.driverDetails?.email,
                phone: this.driverDetails?.phone,
                adhar_no: this.driverDetails.adhar_no,
                dl_no: this.driverDetails?.dl_no,
                ambulance_id: ambulanceIds.map((mt: any) => {
                  let object: any = {
                    id: mt.id,
                    name: mt.name,
                  };
                  console.log('mtttt', object);
                  this.onSelectAmbulanceService(object);
                  return object;
                }),
              });
          });
      }
    });
  }

  onStatusChange(event: any) {
    console.log(event.target.value);
    if (event.target.checked) {
      this.is_checked = 1;
      console.log('ok', this.is_checked);
    } else {
      this.is_checked = 0;
      console.log('ok', this.is_checked);
    }
  }

  onProfileUpload(profile: any) {
    if (profile.target.files && profile.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileUrl = e.target.result;
      };
      reader.readAsDataURL(profile.target.files[0]);
      this.profileSrc = profile.target.files[0];
    }
  }

  onAdharFrontUpload(file: any) {
    // console.log(uploadedFile.target.files[0]);
    if (file.target.files && file.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.adharFrontUrl = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);
      this.adharFrontSrc = file.target.files[0];
    }
  }

  onAdharBackUpload(file: any) {
    if (file.target.files && file.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.adharBackUrl = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);
      this.adharBackSrc = file.target.files[0];
    }
  }

  onDLUpload(file: any) {
    if (file.target.files && file.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.dlUrl = e.target.result;
      };
      reader.readAsDataURL(file.target.files[0]);
      this.dlSrc = file.target.files[0];
    }
  }

  onUpdate() {
    this.isBtnLoading = true;
    let driverData: any = this.driverForm.value;
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,

      confirmButtonText: `Save`,
      denyButtonText: `cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const save_inputs = new FormData();
        save_inputs.append('name', driverData['name']);
        save_inputs.append('email', driverData['email']);
        save_inputs.append('phone', driverData['phone']);
        save_inputs.append('adhar_no', driverData['adhar_no']);
        save_inputs.append('dl_no', driverData['dl_no']);
        save_inputs.append('is_active', this.is_checked);
        save_inputs.append('ambulance_id', this.ambulanceId);

        save_inputs.append('profile_image', this.profileSrc);
        save_inputs.append('adhar_front_image', this.adharFrontSrc);
        save_inputs.append('adhar_back_image', this.adharBackSrc);
        save_inputs.append('dl_image', this.dlSrc);

        /*   if(driver.length > 0){
            driver.value.forEach((emp:any) => { save_inputs.append('document', emp); });
          } */
        if (this.driverId == 0) {
          //add
          this.driverService
            .addDriver(save_inputs)
            .subscribe((response: any) => {
              console.log(response);
              this.toaster.success(response?.message);
              setTimeout(() => {
                this.isBtnLoading = false;
                this.router.navigate(['/admin/driver']);
                Swal.fire('Saved!', '', 'success');
              }, 2000);
              Swal.fire('Saved!', '', 'success');
            });
        } else {
          // save_inputs.append('id', this.driverId);
          this.driverService
            .updateDrivers(this.driverId, save_inputs)
            .subscribe((response: any) => {
              console.log(response);
              this.toaster.success(response?.message);
              setTimeout(() => {
                this.isBtnLoading = false;
                this.router.navigate(['/admin/driver']);
                Swal.fire('Saved!', '', 'success');
              }, 2000);
            });
        }
      } else if (result.isDenied) {
        this.isBtnLoading = false;

        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  breadCrumbDetails() {
    if (this.router.url === '/admin/driver/add-driver') {
      this.breadCrumbData = {
        heading: 'Add Driver',
        routing: [
          {
            routerHeading: 'driver',
            routerLink: '/admin/driver',
          },
          {
            routerHeading: 'add-driver',
            routerLink: '/admin/driver/add-driver',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'Edit Driver',
        routing: [
          {
            routerHeading: 'driver',
            routerLink: '/admin/driver',
          },
          {
            routerHeading: 'edit-driver',
            routerLink: '/admin/driver/edit-driver',
          },
        ],
      };
    }
  }
  get name() {
    // console.log('ok');
    return this.driverForm.get('name');
  }
  get email() {
    return this.driverForm.get('email');
  }
  get phone() {
    return this.driverForm.get('phone');
  }
  get adhar_no() {
    return this.driverForm.get('adhar_no');
  }
  get dl_no() {
    return this.driverForm.get('dl_no');
  }
  get profile_image() {
    return this.driverForm.get('profile_image');
  }
  get adhar_front_Image() {
    return this.driverForm.get('adhar_front_Image');
  }
  get adhar_back_Image() {
    return this.driverForm.get('adhar_back_Image');
  }
  get dl_image() {
    return this.driverForm.get('dl_image');
  }
  get is_active() {
    return this.driverForm.get('is_active');
  }
}
