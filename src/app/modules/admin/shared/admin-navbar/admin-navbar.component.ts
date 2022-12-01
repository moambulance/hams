import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
})
export class AdminNavbarComponent implements OnInit {
  toggle: boolean = false;
  @Input() hamburgerClass: any;
  @Output() burgerClicked: EventEmitter<any> = new EventEmitter();
  userDetails: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // const token: any = sessionStorage.getItem('token');
    this.userDetails = this.authService.getRole();
    // console.log('*********', this.userDetails);
  }
  onToggle() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      // this.classHamburger = 'hamburger is-active';
      this.burgerClicked.emit('show menu-toggle');
    } else {
      this.burgerClicked.emit('show');
    }
  }
  onLogout() {
    this.authService.onAdminLogout();
    this.router.navigate(['/admin/login']);
  }
}
