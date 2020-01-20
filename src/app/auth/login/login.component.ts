import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  isSubmiting: boolean;
  msgError: string;

  constructor(private authService: AuthService) {
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
    console.log('data', data);
    // this.authService.logIn(data.email, data.password);
    this.authService.logInPromise(data.email, data.password)
      .then((user) => {
        console.log('login exitoso: ', user);
        // this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('error en el login: ', error);
        this.msgError = error.message;
      });
  }

}
