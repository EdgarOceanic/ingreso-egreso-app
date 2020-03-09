import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEngreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {



  constructor(private afDB: AngularFirestore, private authService: AuthService) { }


  crearIngresoEgreso(ingresoEgreso: IngresoEngreso): Promise<any> {

    const user = this.authService.getUser();

    return this
      .afDB
      .doc(`${user.uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }



}
