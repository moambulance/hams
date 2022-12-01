import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-janitri-vitals',
  templateUrl: './janitri-vitals.component.html',
  styleUrls: ['./janitri-vitals.component.css']
})
export class JanitriVitalsComponent implements OnInit {
  @Output() closeClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onCloseClick() {
    this.closeClick.emit();
  }

}
