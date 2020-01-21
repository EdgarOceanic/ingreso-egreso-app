import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GlobalService } from 'src/app/global/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  isSubmiting = false;

  constructor(private authService: AuthService, private globalService: GlobalService) { }

  ngOnInit() {
  }

  submitForm(a): void {
    this.isSubmiting = true;
    // this.authService.crearUsuario(a.nombre, a.email, a.password);
    this.authService.crearUsuarioPromise(a.nombre, a.email, a.password)
      .then(resp => {
        this.authService
          .createUserDocumentDB(a.nombre, resp)
          .then(() => this.globalService.navigateTo('/'))
          .catch(err => this.globalService.showModalError('No se pudo crear documento', err.message));
      })
      .catch(error => {
        this.globalService.showModalError('Ocurrió un error al registrarse', error.message);
      });
  }

}

export interface Data {
  email: string;
  nombre: string;
  password: string;
}
