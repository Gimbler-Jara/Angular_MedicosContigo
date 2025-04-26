import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { MedicoConUsuario } from '../../interface/MedicoConUsuario.interface';
import { Especialidad } from '../../interface/Especialidad.interface';
import { AgendarCitaMedicaDTO } from '../../DTO/CitaMedica.interface';
import { UsuarioRequest, UsuarioResponse } from '../../interface/Usuario/Usuario.interface';
import { AuthService } from '../../services/auth.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { MedicosPorEspecialidadDTO } from '../../DTO/MedicosPorEspecialidad.interface';
import { HorasDispiniblesDTO } from '../../DTO/HorasDispinibles.interface';
import { obtenerProximaFecha } from '../../utils/utilities';
import { CitasReservadasPorPacienteResponseDTO } from '../../DTO/CitasReservadasPorPaciente.interface';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  authService = inject(AuthService);
  citasService = inject(CitasService)
  especialidadService = inject(EspecialidadService)

  vista: 'citas' | 'reservar' | 'extra' = 'citas';

  usuario: UsuarioResponse = this.authService.getUsuarioStorage()!;

  citasRegistradas: CitasReservadasPorPacienteResponseDTO[] = []


  especialidades$ = this.especialidadService.listarEspecialidades();
  especialidadSeleccionada?: Especialidad;
  // medicos = this.citasService.getMedicos();

  medicosFiltrados: MedicosPorEspecialidadDTO[] = [];
  fechasFiltradas: string[] = [];
  horasFiltradas: HorasDispiniblesDTO[] = [];

  // especialidadSeleccionada: Especialidad | null = null;
  medicoSeleccionado: MedicosPorEspecialidadDTO | null = null;
  fechaSeleccionada: string | null = null;
  horaSeleccionada: number | null = null;

  constructor(private citaService: CitasService) { }


  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.listarCitasReservadasPorPaciente();
  }

  seleccionarEspecialidad(esp: Especialidad) {
    this.especialidadSeleccionada = esp;
    this.citasService.listarMedicosPorEspecialidad(esp.id).then((data) => {
      this.medicosFiltrados = data
      console.log(this.medicosFiltrados);

      this.medicoSeleccionado = null;
      this.fechaSeleccionada = null;
      this.horaSeleccionada = null;
      this.fechasFiltradas = [];
      this.horasFiltradas = [];
    }).catch((error) => {
      console.log(error);
    });
  }

  seleccionarMedico(medico: MedicosPorEspecialidadDTO) {
    this.medicoSeleccionado = medico;
    this.citasService.listarDiasDisponibles(medico.id!).then((datos) => {
      const dias = datos;
      this.fechasFiltradas = dias.map(d => d.dia);
      console.log(this.fechasFiltradas);
      this.fechaSeleccionada = null;
      this.horasFiltradas = [];
    }).catch((error) => {
      console.log(error);
    });


  }

  seleccionarFecha(dia: string) {
    const fecha = obtenerProximaFecha(dia);
    this.fechaSeleccionada = fecha;
    if (this.medicoSeleccionado?.id == undefined)
      return;

    this.citasService.listarHorasDisponibles(this.medicoSeleccionado.id, fecha).then(data => {
      this.horasFiltradas = data;
    });
    // } else {
    //   console.error('El ID del médico seleccionado es undefined');
    // }
    this.horaSeleccionada = null;
  }

  seleccionarHora(hora: number) {
    this.horaSeleccionada = hora;
  }

  confirmarCita() {
    if (this.especialidadSeleccionada && this.medicoSeleccionado && this.fechaSeleccionada && this.horaSeleccionada) {

      const nuevaCita: AgendarCitaMedicaDTO = {
        idMedico: this.medicoSeleccionado.id!,
        idPaciente: this.usuario.id ?? 1,
        fecha: this.fechaSeleccionada,
        idHora: this.horaSeleccionada,
        estado: 1
      }

      console.log(nuevaCita);
      this.citaService.agendarCita(nuevaCita)

      // this.especialidadSeleccionada = null;
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



  // getNombreMedico(id: number): string {
  //   const medico = this.citaService.getMedicos().find(m => m.usuario.id === id);
  //   return medico ? `${medico.usuario.firstName} ${medico.usuario.lastName}` : 'Desconocido';
  // }

  // getEspecialidadMedico(id: number): string {
  //   const medico = this.citaService.getMedicos().find(m => m.usuario.id === id);
  //   const esp = this.citaService.getEspecialidades().find(e => e.id === medico?.especialidad_id);
  //   return esp ? esp.especialidad : 'Especialidad no registrada';
  // }


  cambiarVista(nuevaVista: 'citas' | 'reservar' | 'extra') {
    this.vista = nuevaVista;
    if (nuevaVista === 'citas') {
      this.listarCitasReservadasPorPaciente();
    }
  }

  async listarCitasReservadasPorPaciente() {
    this.citaService.listarCitasReservadasPorPaciente(this.usuario.id!).then((data) => {
      this.citasRegistradas = data;
    })
  }

}