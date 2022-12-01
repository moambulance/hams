import { Component, Input, OnInit } from '@angular/core';
import { CommonEventsService } from 'src/app/common-events.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadCrumbData: any;
  constructor(private commonEventService: CommonEventsService) {}

  ngOnInit(): void {}
  //  Sidebar Toggle Click //
  sidebarToggle!: boolean;
  onToggleClick() {
    if (this.sidebarToggle) {
      this.sidebarToggle = !this.sidebarToggle;
      this.commonEventService.onSidebarToggle(this.sidebarToggle);
    } else {
      this.sidebarToggle = !this.sidebarToggle;
      this.commonEventService.onSidebarToggle(this.sidebarToggle);
    }
  }
  //  Sidebar Toggle Click End//
}
