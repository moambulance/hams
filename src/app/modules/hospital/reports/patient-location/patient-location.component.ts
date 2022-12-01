import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-location',
  templateUrl: './patient-location.component.html',
  styleUrls: ['./patient-location.component.css']
})
export class PatientLocationComponent implements OnInit {
  breadCrumbData: any = {
    heading: "Patient Location",
    routing: [
      {
        routerHeading: "reports",
        routerLink: "/hospital/reports/patient-location",
      },
    ],
  };
  constructor() { }

  ngOnInit(): void {
  }

}
