import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { MedicoConUsuario } from '../../interface/MedicoConUsuario.interface';
import { Especialidad } from '../../interface/Especialidad.interface';
import { CitaMedica } from '../../interface/CitaMedica.interface';
import { Usuario } from '../../interface/Usuario.interface';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  vista: 'citas' | 'reservar' | 'extra' = 'citas';

  usuario: Usuario = {
    id: 1,
    document_type: 1,
    dni: '12345678',
    first_name: 'Luis',
    last_name: 'Torres',
    middle_name: 'Pérez',
    birth_date: '1990-05-15',
    gender: 'M',
    telefono: '987654321',
    email: 'luis@example.com',
    password_hash: 'hashed_password_123', // simulado
    rol_id: 1 // por ejemplo, 1 = paciente
  };

  citasAtendidas: CitaMedica[] = []


  especialidades = this.citaService.getEspecialidades();
  medicos = this.citaService.getMedicos();

  medicosFiltrados: MedicoConUsuario[] = [];
  fechasFiltradas: string[] = [];
  horasFiltradas: number[] = [];

  especialidadSeleccionada: Especialidad | null = null;
  medicoSeleccionado: MedicoConUsuario | null = null;
  fechaSeleccionada: string | null = null;
  horaSeleccionada: number | null = null;

  constructor(private citaService: CitasService) { }

  seleccionarEspecialidad(esp: Especialidad) {
    this.especialidadSeleccionada = esp;
    this.medicosFiltrados = this.citaService.getMedicosPorEspecialidad(esp.id);
    this.medicoSeleccionado = null;
    this.fechaSeleccionada = null;
    this.horaSeleccionada = null;
    this.fechasFiltradas = [];
    this.horasFiltradas = [];
  }

  seleccionarMedico(medico: MedicoConUsuario) {
    this.medicoSeleccionado = medico;
    this.fechasFiltradas = this.citaService.getDiasDisponibles(medico.usuario.id);
    this.fechaSeleccionada = null;
    this.horasFiltradas = [];
  }

  seleccionarFecha(fecha: string) {
    this.fechaSeleccionada = fecha;
    this.horasFiltradas = this.citaService.getHorasDisponibles(fecha);
    this.horaSeleccionada = null;
  }

  seleccionarHora(hora: number) {
    this.horaSeleccionada = hora;
  }

  confirmarCita() {
    if (this.especialidadSeleccionada && this.medicoSeleccionado && this.fechaSeleccionada && this.horaSeleccionada) {
      // const nuevaCita = {
      //   especialidad: this.especialidadSeleccionada.especialidad,
      //   medico: `${this.medicoSeleccionado.usuario.first_name} ${this.medicoSeleccionado.usuario.last_name}`,
      //   fecha: this.fechaSeleccionada,
      //   hora: this.horaSeleccionada
      // };

      const citaParaServicio: CitaMedica = {
        id: 0,
        id_medico: this.medicoSeleccionado.usuario.id,
        id_paciente: this.usuario.id ?? 1,
        fecha: this.fechaSeleccionada,
        idHora: this.horaSeleccionada,
        estado: 1
      }

      this.citaService.agendarCita(citaParaServicio)
      this.citasAtendidas = this.citaService.citasAtendidas;

      // console.log('✅ Cita agendada:', nuevaCita);
      alert('Cita agendada exitosamente');

      this.especialidadSeleccionada = null;
      this.medicoSeleccionado = null;
      this.fechaSeleccionada = null;
      this.horaSeleccionada = null;
      this.medicosFiltrados = [];
      this.fechasFiltradas = [];
      this.horasFiltradas = [];
    }
  }

  // obtenerIdHora(hora: number): number {
  //   const todasHoras = this.citaService.getHorasDisponibles(this.fechaSeleccionada!);
  //   return todasHoras.indexOf(hora) + 1; // simulado, reemplazar por ID real si tienes mapeo
  // }

getHoraTexto(id: number): string {
  return this.citaService.getHoraById(id);
}

  

  getNombreMedico(id: number): string {
    const medico = this.citaService.getMedicos().find(m => m.usuario.id === id);
    return medico ? `${medico.usuario.first_name} ${medico.usuario.last_name}` : 'Desconocido';
  }

  getEspecialidadMedico(id: number): string {
    const medico = this.citaService.getMedicos().find(m => m.usuario.id === id);
    const esp = this.citaService.getEspecialidades().find(e => e.id === medico?.especialidad_id);
    return esp ? esp.especialidad : 'Especialidad no registrada';
  }


}
