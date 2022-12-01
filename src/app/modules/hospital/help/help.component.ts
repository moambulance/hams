import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent implements OnInit {
  breadCrumbData: any = {
    heading: 'Help',
    routing: [
      {
        routerHeading: 'help',
        routerLink: '/hospital/help',
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {}
}
