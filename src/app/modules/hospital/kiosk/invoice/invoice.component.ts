import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { KioskService } from '../kiosk.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit, OnChanges {
  @Input('order') order: any;

  constructor(private kioskService: KioskService) { }
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    console.log(this.order)

  }


}
