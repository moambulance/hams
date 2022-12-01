import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css'],
})
export class AddAdminComponent implements OnInit {
  adminForm!: FormGroup;
  constructor() {}

  ngOnInit(): void {}
  onSubmit() {
    console.log('admin', this.adminForm.value);
  }
}
