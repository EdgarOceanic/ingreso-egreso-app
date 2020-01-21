import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { GlobalService } from '../global/global.service';

import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'url';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
    private globalService: GlobalService,
    private afDB: AngularFirestore,
    private router: Router) { }

  initAuthListener(): void {
    this.afAuth.authState.subscribe(firebaseUser => {
      console.log(firebaseUser);
    });
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
    return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          resolve(userCredential);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  createUserDocumentDB(nombre: string, userCredential: firebase.auth.UserCredential): Promise<void> {
    const user: User = {
      uid: userCredential.user.uid,
      nombre: nombre,
      email: userCredential.user.email
    };
    return new Promise<void>((resolve, reject) => {
      this.afDB
        .doc(`${user.uid}/usuario`)
        .set(user)
        .then(() => resolve())
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
