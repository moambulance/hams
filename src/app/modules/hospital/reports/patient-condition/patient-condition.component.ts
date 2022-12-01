import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-condition',
  templateUrl: './patient-condition.component.html',
  styleUrls: ['./patient-condition.component.css']
})
export class PatientConditionComponent implements OnInit {
  breadCrumbData: any = {
    heading: "Patient Condition",
    routing: [
      {
        routerHeading: "reports",
        routerLink: "/hospital/reports/patient-condition",
      },
    ],
  };
  constructor() { }

  ngOnInit(): void {
  }

}
