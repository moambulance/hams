import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
})
export class PatientDetailsComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @ViewChild('imageModal') imageModal!: ElementRef;
  breadCrumbData: any = {
    heading: 'Patient Details',
    routing: [
      {
        routerHeading: 'Patient',
        routerLink: '/admin/patients',
      },
      {
        routerHeading: 'Patient Details',
        routerLink: '/admin/patients/patientDetails',
      },
    ],
  };
  patientDetails: any;

  isAudio: boolean = false;
  currentIndex: any;
  currentSrc: any;
  medtelIotDetails: any;
  currentRoute: any;
  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    const loc = location.path().includes("hospital")
    this.currentRoute = loc;
  }

  ngOnInit(): void {
    this.getPatientDetails();
  }
  getPatientDetails() {
    let id: any;
    this.route.params.subscribe((params: Params) => {
      console.log("params");
      id = +params['id'];
    });

    this.patientService.patientDetails(id).subscribe((patientDetails: any) => {
      console.log(patientDetails);
      this.patientDetails = patientDetails.data;
      if (patientDetails.data.medtel_iot.length > 0) {
        this.medtelIotDetails = patientDetails.data.medtel_iot.map(
          (response: any, index: any) => {
            return {
              ...response,
              isActive: index === 0 ? true : false,
            };
          },
        );
      }
    });
  }
  onPlay(i: any) {
    this.currentIndex = i;
    this.audioPlayer.nativeElement.play();
    this.isAudio = true;
    console.log(this.audioPlayer.nativeElement.duration());
    // this.audioPlayer.nativeElement.duration();
  }
  onPause(i: any) {
    this.currentIndex = i;
    this.audioPlayer.nativeElement.pause();
    this.isAudio = false;
  }
  onimageClick(src: any) {
    this.currentSrc = src;
    this.imageModal.nativeElement.click();
  }
  onAccordionClick(medtelDetails: any) {
    console.log(medtelDetails.IsActive);

    medtelDetails.IsActive = !medtelDetails.IsActive;
  }
}
