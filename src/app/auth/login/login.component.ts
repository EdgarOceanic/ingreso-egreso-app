import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GlobalService } from 'src/app/global/global.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  isSubmiting: boolean;
  msgError: string;

  constructor(private authService: AuthService, private globalService: GlobalService) {
    this.isSubmiting = false;
  }

  ngOnInit() {
  }

  submitLoginForm(data: any, isValidForm: boolean): void {
    this.isSubmiting = true;
    this.msgError = null;

    if (!isValidForm) {
      this.msgError = 'Completa todos los campos del formulario';
      return;
    }
    // this.authService.logIn(data.email, data.password);

    this.authService.logInPromise(data.email, data.password)
      .then((user) => {
        this.globalService.navigateTo('/');
      })
      .catch((error) => {
        this.globalService.showModalError('Error en el login', error.message);
      });
  }

}
