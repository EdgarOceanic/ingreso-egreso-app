import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  isSubmiting = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  submitForm(a): void {
    this.isSubmiting = true;
    const data: Data = a;
    console.log('data', data);
    this.authService.crearUsuario(a.nombre, a.email, a.password);
  }

}

export interface Data {
  email: string;
  nombre: string;
  password: string;
}
