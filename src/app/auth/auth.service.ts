import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
    private router: Router) { }

  crearUsuario(nombre: string, email: string, password: string): void {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error(error);
      });
  };

  logIn(email: string, password: string): void {
    this
      .afAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error(error);
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


}
