import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { GlobalService } from 'src/app/global/global.service';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from 'src/app/shared/ui.acciones';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  isSubmiting: boolean;
  msgError: string;

  isLoading: boolean;
  private subscription: Subscription;

  constructor(private authService: AuthService, private globalService: GlobalService, private store: Store<AppState>) {
    this.isSubmiting = false;
  }

  ngOnInit() {
    this.subscription = this.store.select('ui').subscribe(
      newState => this.isLoading = newState.isLoading
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  submitLoginForm(form: NgForm): void {
    this.isSubmiting = true;
    this.msgError = null;

    if (form.invalid) {
      this.msgError = 'Completa todos los campos del formulario';
      return;
    }
    // this.authService.logIn(data.email, data.password);

    const data = form.value;

    this.store.dispatch(new ActivarLoadingAction());
    this.authService.logInPromise(data.email, data.password)
      .then((user) => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.globalService.navigateTo('/');
      })
      .catch((error) => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.globalService.showModalError('Error en el login', error.message);
      });
  }

}
