import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { NgForm } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  //Old Template Driven Form
  //
  // customer = new Customer();

  // constructor() { }

  // ngOnInit(): void {
  // }

  // save(customerForm: NgForm): void {
  //   console.log(customerForm.form);
  //   console.log('Saved: ' + JSON.stringify(customerForm.value));
  // }

  //Another way to initialize a form Group
  //
  // customerForm = new FormGroup({
  //   firstName: new FormControl('Vincent Angelo',[
  //   Validators.required
  // ]),
  //   lastName: new FormControl('Flores'),
  //   email: new FormControl('vincentflores88@gmail.com'),
  //   sendCatalog: new FormControl(true)
  // });

  customerForm!: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    //form builder: initializing the form
    //
    this.customerForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      sendCatalog: true
    });

    //Reactive Form: initializing the form
    //
    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true),
    // });
  }

  populateTestData(): void{

    //setting initial values of all form controls:
    //
    // this.customerForm.setValue({
    //   firstName: 'Jack',
    //   lastName: 'Harkness',
    //   email: 'jack@torchwood.com',
    //   sendCatalog: false
    // });

    //setting initial values of some form controls
    //
    this.customerForm.patchValue({
      firstName: 'Gerard Angelo',
      lastName: 'Araneta'
    });
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm));
  }

  get firstName(){
    return this.customerForm.get('firstName');
  }

  get lastName(){
    return this.customerForm.get('lastName');
  }

  get email(){
    return this.customerForm.get('email');
  }

  get sendCatalog(){
    return this.customerForm.get('sendCatalog');
  }
}
