import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  isSubmiting = false;

  constructor() { }

  ngOnInit() {
  }

  submitForm(a): void {
    this.isSubmiting = true;
    const data: Data = a;
    console.log('data', data);
  }

}

export interface Data {
  email: string;
  nombre;
}
