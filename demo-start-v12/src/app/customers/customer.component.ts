import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
// import { NgForm } from '@angular/forms';

import { Customer } from './customer';

//to make a validator function with parameters wrap the validator function into a vaidator factory
//and transform the validator function into an arrow function
function ratingRange(min: number, max: number): ValidatorFn{

  return (c: AbstractControl): { [key: string]: boolean } | null => {
    //if the statement within the if statemetn is true, it means there is an error and the validation is triggered
    if(c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)){
      return {'range': true};
    }
    //return null if no error
    return null;
  }

}

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
  //   Validators.required,
  //    Validators.minLength(3)
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
      firstName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      email: ['',[
        Validators.required,
        Validators.email
      ]],
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1,5)],
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
      lastName: 'Araneta',
      email: 'vincentflores88@tgmail.com'
    });
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm));
  }

  setNotification(notifyVia: string): void{
    if(notifyVia == 'text'){
      this.phone?.setValidators(Validators.required);
    } else {
      this.phone?.clearValidators();
    }

    this.phone?.updateValueAndValidity();
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

  get phone(){
    return this.customerForm.get('phone');
  }

  get rating(){
    return this.customerForm.get('rating');
  }
}
