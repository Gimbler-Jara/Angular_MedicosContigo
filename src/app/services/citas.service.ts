import { Injectable } from '@angular/core';
import { Especialidad } from '../interface/Especialidad.interface';
import { Usuario } from '../interface/Usuario.interface';
import { CitaMedica } from '../interface/CitaMedica.interface';
import { MedicoConUsuario } from '../interface/MedicoConUsuario.interface';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private especialidades: Especialidad[] = [
    { id: 1, especialidad: 'Cardiología' },
    { id: 2, especialidad: 'Pediatría' },
    { id: 3, especialidad: 'Dermatología' },
  ];

  private medicos: MedicoConUsuario[] = [
    {
      usuario: {
        id: 1, first_name: 'Juan', last_name: 'Ramírez', document_type: 1, dni: '12345678', birth_date: '1990-01-01', gender: 'M', password_hash: '', rol_id: 2, telefono: '999111222', email: 'juan.ramirez@example.com'
      }, especialidad_id: 1
    },
    {
      usuario: {
        id: 2, first_name: 'Ana', last_name: 'Soto', document_type: 1, dni: '87654321', birth_date: '1985-02-02', gender: 'F', password_hash: '', rol_id: 2, telefono: '999333444', email: 'ana.soto@example.com'
      }, especialidad_id: 2
    },
    {
      usuario: {
        id: 3, first_name: 'Luis', last_name: 'Rivas', document_type: 1, dni: '11223344', birth_date: '1992-03-03', gender: 'M', password_hash: '', rol_id: 2, telefono: '999555666', email: 'luis.rivas@example.com'
      }, especialidad_id: 1
    }
  ];


  private diasDisponibles: { [idMedico: number]: string[] } = {
    1: ['2025-04-20', '2025-04-22'],
    2: ['2025-04-21'],
    3: ['2025-04-20', '2025-04-23']
  };

  private horasDisponibles: { [fecha: string]: number[] } = {
    '2025-04-20': [1, 2, 3],
    '2025-04-21': [4, 5],
    '2025-04-22': [2, 6],
    '2025-04-23': [1, 7]
  };

  citasAtendidas: CitaMedica[] = [];

  constructor() { }

  private horasCatalogo: { [id: number]: string } = {
    1: '09:00',
    2: '10:00',
    3: '11:00',
    4: '12:00',
    5: '13:00',
    6: '14:00',
    7: '15:00',
    8: '16:00'
  };
  
  getHoraById(id: number): string {
    return this.horasCatalogo[id] || 'Hora no encontrada';
  }
  

  getEspecialidades(): Especialidad[] {
    return this.especialidades;
  }

  getMedicos(): MedicoConUsuario[] {
    return this.medicos;
  }

  getMedicosPorEspecialidad(especialidadId: number): MedicoConUsuario[] {
    return this.medicos.filter(m => m.especialidad_id === especialidadId);
  }

  getDiasDisponibles(idMedico: number): string[] {
    return this.diasDisponibles[idMedico] || [];
  }

  getHorasDisponibles(fecha: string): number[] {
    return this.horasDisponibles[fecha] || [];
  }

  agendarCita(cita: CitaMedica): void {
    console.log('Cita agendada (simulada)', cita);
    this.citasAtendidas.push(cita);

    // Eliminar la hora agendada de la lista de horas disponibles
    const horas = this.horasDisponibles[cita.fecha];
    if (horas) {
      this.horasDisponibles[cita.fecha] = horas.filter(h => h !== cita.idHora);
    }
  }

  
}
