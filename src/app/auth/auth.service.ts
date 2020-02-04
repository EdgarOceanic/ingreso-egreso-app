import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { GlobalService } from '../global/global.service';

import { map } from 'rxjs/operators';
import * as UserModel from './user.model';

import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.acciones';
import { SetUserAction } from './auth.actions';
import { User } from 'firebase/app';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription;

  constructor(private afAuth: AngularFireAuth,
    private globalService: GlobalService,
    private afDB: AngularFirestore,
    private store: Store<AppState>,
    private router: Router) { }

  initAuthListener(): void {
    this.afAuth.authState.subscribe(user => this.handleFirebaseUser(user));
  }



  private handleFirebaseUser(user: User): void {
    if (user) {
      this.userSubscription = this.afDB
        .doc(`${user.uid}/usuario`)
        .valueChanges()
        .subscribe((userData: UserModel.User) => {
          console.log('change:', user.email + ' - ' + Math.random() / 10);
          const authAction = new SetUserAction(userData);
          this.store.dispatch(authAction);
        });
    } else {
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
    }

  }

  crearUsuario(nombre: string, email: string, password: string): void {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error(error);
      });
  };


  crearUsuarioPromise(nombre: string, email: string, password: string): Promise<firebase.auth.UserCredential> {

    this.store.dispatch(new ActivarLoadingAction());

    return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          resolve(userCredential);
        })
        .catch(error => {
          this.store.dispatch(new DesactivarLoadingAction());
          reject(error);
        });
    });
  }


  createUserDocumentDB(nombre: string, userCredential: firebase.auth.UserCredential): Promise<void> {
    const user: UserModel.User = {
      uid: userCredential.user.uid,
      nombre: nombre,
      email: userCredential.user.email
    };
    return new Promise<void>((resolve, reject) => {
      this.afDB
        .doc(`${user.uid}/usuario`)
        .set(user)
        .then(() => {
          this.store.dispatch(new DesactivarLoadingAction());
          resolve();
        })
        .catch(error => reject(error));
    });
  }

  logIn(email: string, password: string): void {
    this
      .afAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error(error);
        Swal.fire('Error en el login', error.message, 'error');
      });
  };



  logInPromise(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this
        .afAuth
        .auth
        .signInWithEmailAndPassword(email, password)
        .then(user => resolve(user))
        .catch(error => reject(error));
    });
  };

  signOut(): void {
    this.afAuth.auth.signOut().then(() => {
      this.globalService.navigateTo('/login');
    });
  }


  isAuth() {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user === null) {
          this.globalService.navigateTo('/login');
          return false;
        } else {
          return true;
        }
      })
    );
  }


}
