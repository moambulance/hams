import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AmbulanceService } from '../ambulance.service';

@Component({
  selector: 'app-ambulance-details',
  templateUrl: './ambulance-details.component.html',
  styleUrls: ['./ambulance-details.component.css'],
})
export class AmbulanceDetailsComponent implements OnInit {
  ambulanceId: any;
  ambulanceDetails: any;
  baseUrl: string = environment.BASE_URL;
  breadCrumbData: any = {
    heading: 'Ambulance Details',
    routing: [
      {
        routerHeading: 'ambulance',
        routerLink: '/admin/ambulance',
      },
      {
        routerHeading: 'ambulance-details',
        routerLink: '/admin/ambulance/ambulance-details',
      },
    ],
  };
  constructor(
    private ambulanceService: AmbulanceService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: any) => {
      this.ambulanceId = param.get('id');
      console.log(this.ambulanceId);
    });
    this.getAmbulaneDetails(this.ambulanceId);
  }
  getAmbulaneDetails(id: any) {
    this.ambulanceService.getAmbulanceById(id).subscribe((result: any) => {
      this.ambulanceDetails = result;
      console.log('this.ambulanceDetails', this.ambulanceDetails);
    });
  }
}
