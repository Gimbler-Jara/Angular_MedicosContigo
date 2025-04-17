import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  formularioContacto: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioContacto = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
      mensaje: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    window.scrollTo(0, 0); 
  }

  enviarFormulario(): void {
    if (this.formularioContacto.valid) {
      const datos = this.formularioContacto.value;
      console.log('Datos enviados:', datos);

      // Aquí puedes conectarlo a un servicio o API
      // this.servicioContacto.enviar(datos).subscribe(...);

      alert('Mensaje enviado con éxito');
      this.formularioContacto.reset();
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }
}
