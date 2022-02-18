import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
// import { NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'

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

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  // if(emailControl?.pristine || confirmControl?.pristine){
  //   return null;
  // }
  // if(emailControl?.value == confirmControl?.value){
  //   return null;
  // }
  // return {'match': true};

  return emailControl?.pristine || confirmControl?.pristine ? null :  emailControl?.value === confirmControl?.value ? null : {'match': true};
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
  emailMessage: string = '';
  private validationMessages: {[key: string]: string} = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  }

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
      emailGroup: new FormGroup({
        email: new FormControl('',[Validators.required,Validators.email]),
        confirmEmail: new FormControl('', [Validators.required])
      }, [emailMatcher]),
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1,5)],
      sendCatalog: true,
      addresses: new FormArray([ this.buildAddress() ])

    });

    //Reactive Form: initializing the form
    //
    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true),
    // });

    this.notifictation?.valueChanges.subscribe(
      value => this.setNotification(value)
    );

    this.email?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe({
      next: value => this.setMessage(this.email)
    });
  }

  buildAddress(): FormGroup{
    return new FormGroup({
      addressType: new FormControl('home'),
      street1: new FormControl(''),
      street2: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl('')
    })
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

  setMessage(c: AbstractControl | null): void{
    if(c == null) return;
    this.emailMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]
      ).join(' ');
    }
  }

  setNotification(notifyVia: string): void{
    if(notifyVia == 'text'){
      // this.customerForm.get('phone')?.setValidators(Validators.required);
      this.phone?.setValidators(Validators.required);
    } else {
      this.phone?.clearValidators();
    }
    this.phone?.updateValueAndValidity();
  }

  get firstName(): AbstractControl{
    return <AbstractControl>this.customerForm.get('firstName');
  }

  get lastName(): AbstractControl{
    return <AbstractControl>this.customerForm.get('lastName');
  }

  get email(): AbstractControl{
    return <AbstractControl>this.customerForm.get('emailGroup.email');
  }

  get notifictation(): AbstractControl{
    return <AbstractControl>this.customerForm.get('notification');
  }

  get sendCatalog(): AbstractControl{
    return <AbstractControl>this.customerForm.get('sendCatalog');
  }

  get phone(): AbstractControl{
    return <AbstractControl>this.customerForm.get('phone');
  }

  get rating(): AbstractControl{
    return <AbstractControl>this.customerForm.get('rating');
  }

  get confirmEmail(): AbstractControl{
    return <AbstractControl>this.customerForm.get('emailGroup.confirmEmail');
  }

  get emailGroup(): AbstractControl{
    return this.customerForm.get('emailGroup') as AbstractControl;
  }

  get addresses(): FormArray{
    return this.customerForm.get('addresses') as FormArray;
  }
}
