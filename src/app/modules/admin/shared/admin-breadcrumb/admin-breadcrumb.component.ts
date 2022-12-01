import { Component, Input, OnInit } from '@angular/core';
import { CommonEventsService } from 'src/app/common-events.service';

@Component({
  selector: 'app-admin-breadcrumb',
  templateUrl: './admin-breadcrumb.component.html',
  styleUrls: ['./admin-breadcrumb.component.css'],
})
export class AdminBreadcrumbComponent implements OnInit {
  constructor(private commonEventService: CommonEventsService) {}
  @Input() breadCrumbData: any;
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
