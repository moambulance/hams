import { MapsAPILoader } from '@agm/core';
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonEventsService } from 'src/app/common-events.service';
import { ToastService } from 'src/app/services/toast-service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AmbulanceService } from '../../ambulance/ambulance.service';
import { CustomerService } from '../../customers/customer.service';
import { DriverService } from '../../driver/driver.service';
import { HospitalService } from '../../hospitals/hospital.service';
import { PatientService } from '../../patients/patient.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
})
export class AddOrderComponent implements OnInit {
  ngOnInit(): void {}
}
