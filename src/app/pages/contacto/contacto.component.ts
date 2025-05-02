import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  formularioContacto: FormGroup;

  constructor(private fb: FormBuilder, private emailService: EmailService) {
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
      var data = {
        nombre: datos.nombre,
        correo: datos.correo,
        telefono: datos.telefono,
        mensaje: datos.mensaje
      }
      this.emailService.contactanos(data);
      this.showAlert('success', 'Mensaje enviado correctamente.');
      this.formularioContacto.reset();
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }


  showAlert(icon: 'warning' | 'error' | 'success', message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: icon,
      title: message
    });
  }
}
