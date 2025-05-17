import { Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { EmailService } from "../services/email.service";
import { getRegisterTemplateHTML } from "./template";

export function obtenerProximaFecha(diaSemana: string): string {
  const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const dia = diaSemana.trim().toLowerCase();

  const hoy = new Date();
  hoy.setHours(12, 0, 0, 0);

  const diaActual = hoy.getDay();
  const diaActualAjustado = (diaActual + 6) % 7;

  const objetivo = dias.indexOf(dia);
  if (objetivo === -1) throw new Error(`Día inválido: ${diaSemana}`);

  let diasParaSumar = objetivo - diaActualAjustado;
  if (diasParaSumar <= 0) diasParaSumar += 7;

  const proximaFecha = new Date(hoy);
  proximaFecha.setDate(hoy.getDate() + diasParaSumar);

  return proximaFecha.toISOString().split('T')[0];
};

export function obtenerDiaSemana(fecha: string | Date): string {
  const date = new Date(fecha);
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return diasSemana[date.getDay()];
}

export function obtenerCamposUsuario(includeEspecialidad: boolean = false): any[] {
  const camposBase = [
    {
      name: 'documentTypeId', label: 'Tipo de Documento', type: 'select', options: [
        { value: 1, label: 'DNI' },
        { value: 2, label: 'Carnet de Extranjería' },
        { value: 3, label: 'Pasaporte' }
      ]
    },
    { name: 'dni', label: 'DNI' },
    { name: 'firstName', label: 'Nombre' },
    { name: 'lastName', label: 'Apellido Paterno' },
    { name: 'middleName', label: 'Apellido Materno' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'birthDate', label: 'Fecha de Nacimiento', type: 'date' },
    {
      name: 'gender', label: 'Género', type: 'select', options: [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Femenino' }
      ]
    },
    { name: 'email', label: 'Correo Electrónico' },
    { name: 'password', label: 'Nueva Contraseña', type: 'password' }
  ];

  if (includeEspecialidad) {
    camposBase.push({ name: 'especialidadId', label: 'Especialidad', type: 'especialidad' });
    camposBase.push({ name: 'cmp', label: 'CMP' });
  }

  return camposBase;
}



export function obtenerValidacionesDeCamposUsuario(usuario: any) {
  return {
    firstName: [usuario.firstName || '', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
    middleName: [usuario.middleName || '', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
    lastName: [usuario.lastName || '', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
    telefono: [usuario.telefono || '', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    birthDate: [usuario.birthDate || '', Validators.required],
    gender: [usuario.gender || '', Validators.required],
    dni: [usuario.dni || '', Validators.required],
    email: [usuario.email || '', [Validators.required, Validators.email]],
    password: [''],
    documentTypeId: [usuario.documentType?.id || null, Validators.required],
  };
}

export function validarEdad(fecha: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  return edad;
}


export function showAlert(icon: 'warning' | 'error' | 'success', message: string) {
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

export function mostrarErroresEdad(edad: number): boolean {
  if (edad < 18) {
    showAlert('error', 'Debe ser mayor de edad para registrarse.');
    return true;
  }
  if (edad > 80) {
    showAlert('error', 'Seleccione correctamente su fecha de nacimiento.');
    return true;
  }
  return false;
}


export async function enviarCorreoBienvenida(emailService: EmailService, nombre: string, apellido: string, email: string, password: string): Promise<void> {
  const mensaje = getRegisterTemplateHTML(nombre, apellido, email, password);
  await emailService.message(email, "Bienvenido a la plataforma de citas médicas. Su registro ha sido exitoso.", mensaje);
}





