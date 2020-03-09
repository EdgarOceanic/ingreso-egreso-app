import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { GlobalService } from 'src/app/global/global.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { NgForm, Form } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  isSubmiting = false;

  isLoading: boolean;


  private registerSubscription: Subscription;

  constructor(private authService: AuthService,
    private globalService: GlobalService,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.registerSubscription = this.store.select('ui').subscribe(
      state => this.isLoading = state.isLoading
    );
  }

  ngOnDestroy() {
    this.registerSubscription.unsubscribe();
  }


  submitForm(form: NgForm): void {
    this.isSubmiting = true;

    if (form.invalid) {
      return;
    }

    const formData = form.value;

    // this.authService.crearUsuario(a.nombre, a.email, a.password);
    this.authService.crearUsuarioPromise(formData.nombre, formData.email, formData.password)
      .then(resp => {
        this.authService
          .createUserDocumentDB(formData.nombre, resp)
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
