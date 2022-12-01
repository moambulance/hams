import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AdvertiseService } from '../advertise.service';

@Component({
  selector: 'app-add-advertise',
  templateUrl: './add-advertise.component.html',
  styleUrls: ['./add-advertise.component.css'],
})
export class AddAdvertiseComponent implements OnInit {
  advertiseId: any;
  isImageChange: boolean = false;
  profileImageBrowse: any;
  advertiseForm: any;
  @ViewChild('profileImageFile') profileImage!: ElementRef;
  advertiseDetails: any;
  advertiseImage: any;
  routerUrl = '';
  breadCrumbData: any;
  baseUrl: string = environment.BASE_URL;
  message: string = '';

  constructor(
    private advertiseService: AdvertiseService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.advertiseForm = this.formBuilder.group({
      link: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      type: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.showSpinner();
    this.routerUrl = this.router.url;
    console.log('>>>', this.routerUrl);

    this.breadCrumbDetails();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.advertiseId = Number(params.get('id'));
      this.advertiseService
        .getAdvertiseById(this.advertiseId)
        .subscribe((response: any) => {
          this.advertiseDetails = response;
          this.updateAdvertiseField(this.advertiseDetails);
          this.advertiseImage = response.image;
        });
    });
  }
  updateAdvertiseField(advertiseDetails: any) {
    this.advertiseForm.patchValue({
      link: advertiseDetails.link,
      priority: advertiseDetails.priority,
      type: advertiseDetails.type,
    });
    this.profileImageBrowse = this.baseUrl + advertiseDetails.image;
  }

  onProfileImageChange(file: any) {
    if (this.advertiseId != '') {
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

  CreateAdvertise() {
    let fd = new FormData();
    fd.append('link', this.advertiseForm.value['link']);
    fd.append('priority', this.advertiseForm.value['priority']);
    fd.append('type', this.advertiseForm.value['type']);
    fd.append('is_active', '1');
    let file = this.profileImage.nativeElement.files[0];
    if (this.advertiseId) {
      fd.append(
        'image',
        this.isImageChange == true ? file : this.advertiseImage,
      );
    } else {
      fd.append('image', file != undefined ? file : '');
    }
    console.log('fd', fd);

    if (!this.advertiseId) {
      this.advertiseService.createAdvertise(fd).subscribe((response: any) => {
        if (response.success) {
          this.message = response.message;
          setTimeout(() => {
            this.message = '';
            this.advertiseForm.reset();
            this.router.navigateByUrl('/admin/advertise');
          });
        } else {
          this.message = response.message;
          setTimeout(() => {
            this.message = '';
            this.advertiseForm.reset();
          });
        }
      });
    } else {
      this.advertiseService
        .updateAdvertise(this.advertiseId, fd)
        .subscribe((response: any) => {
          if (response.success) {
            this.message = response.message;
            setTimeout(() => {
              this.message = '';
              this.advertiseForm.reset();
              this.router.navigateByUrl('/admin/advertise');
            });
          } else {
            this.message = response.message;
            setTimeout(() => {
              this.message = '';
              this.advertiseForm.reset();
            });
          }
        });
    }
  }
  breadCrumbDetails() {
    if (this.router.url === '/admin/advertise/add-advertise') {
      this.breadCrumbData = {
        heading: 'Add Advertisement',
        routing: [
          {
            routerHeading: 'advertise',
            routerLink: '/admin/advertise',
          },
          {
            routerHeading: 'add-hospital',
            routerLink: '/admin/advertise/add-advertise',
          },
        ],
      };
    } else {
      this.breadCrumbData = {
        heading: 'Edit Advertisement',
        routing: [
          {
            routerHeading: 'advertise',
            routerLink: '/admin/advertise',
          },
          {
            routerHeading: 'edit-hospital',
            routerLink: '/admin/advertise/edit-advertise',
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
}
