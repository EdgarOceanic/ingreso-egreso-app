import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEngreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit {

  tipo = 'ingreso';

  form: FormGroup;

  isSubmiting = false;

  constructor(private ingresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.createIngresoEgresoForm();
  }


  submitIngresoEgresoForm(): void {
    this.isSubmiting = true;

    if (this.form.invalid) {
      return;
    }

    const { monto, descripcion } = this.form.value;

    const model: IngresoEngreso = {
      monto, descripcion, tipo: this.tipo
    };

    this.ingresoService
      .crearIngresoEgreso(model)
      .then(() => {
        Swal.fire( `${this.tipo} agregado`, `Product: ${descripcion}`, 'success');
        this.isSubmiting = false;
        this.form.reset({
          monto: 1
        });
      })
      .catch(err => {
        Swal.fire('Error en el login', err.message, 'error');
      });

  }


  private createIngresoEgresoForm(): void {
    this.form = new FormGroup({
      descripcion: new FormControl('', [Validators.required]),
      monto: new FormControl(0, [Validators.min(0)])
    });
  }

}

