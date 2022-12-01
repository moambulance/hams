import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonEventsService } from './common-events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'HAMS-app';
  toggle!: boolean;
  currentUrl: any;
  constructor(
    private commonEventsService: CommonEventsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.toggle = false;
    // this.checkKiosk();
  }
  eventCheck() {
    this.toggle = this.commonEventsService.toggle;
  }

}
