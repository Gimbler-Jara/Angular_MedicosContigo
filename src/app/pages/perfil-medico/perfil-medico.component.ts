import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CitasAgendadasResponse } from '../../DTO/CitasAgendada.response.DTO';
import { CitasService } from '../../services/citas.service';
import { RegistrarDisponibilidadCitaDTO } from '../../DTO/RegistrarDisponibilidad.DTO';
import { MedicoService } from '../../services/medico.service';
import { DisponibilidadCitaPorMedicoDTO } from '../../DTO/DisponibilidadCitaPorMedico.DTO';
import { CambiarEstadoDisponibilidadDTO } from '../../DTO/CambiarEstadoDisponibilidad.DTO';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Especialidad } from '../../interface/Especialidad.interface';
import { MedicamentoInputDTO } from '../../DTO/MedicamentoInput.DTO';
import { DiasSemanaService } from '../../services/dias-semana.service';
import { DiaSemana } from '../../interface/DiaSemana.interface';
import { DetalleCitaAtendida } from '../../DTO/DetalleCitaAtendida.DTO';
import { PacienteService } from '../../services/paciente.service';
import { UsuarioStorage } from '../../DTO/UsuarioStorage.DTO';
import { obtenerDiaSemana, showAlert } from '../../utils/utilities';
import { Router, RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-perfil-medico',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule, LoadingComponent],
  templateUrl: './perfil-medico.component.html',
  styleUrl: './perfil-medico.component.css',
})
export class PerfilMedicoComponent {
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  citasService = inject(CitasService);
  medicoService = inject(MedicoService);
  diasSemanaService = inject(DiasSemanaService);
  pacienteService = inject(PacienteService);
  router = inject(Router);

  vista: 'citas' | 'agregar' | 'eliminar' = 'citas';

  citasProgramadas: CitasAgendadasResponse[] = [];
  citasFiltradas = [...this.citasProgramadas];

  disponibilidades: DisponibilidadCitaPorMedicoDTO[] = [];
  historialPaciente: DetalleCitaAtendida[] = [];
  mostrarHistorial: boolean = false;
  isLoading = false;

  filtroDia = 0;
  diasSemana: DiaSemana[] = [];
  horas = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ];

  nuevaDisponibilidad = { dia: 0, hora: '' };
  especialidad: Especialidad = { id: 0, especialidad: '' };
  usuario: UsuarioStorage = this.localStorageService.getUsuario()!;

  diagnostico: string = '';
  medicamentos: MedicamentoInputDTO[] = [{ medicamento: '', indicaciones: '' }];

  idCitaSeleccionada: number = 0;
  mostrarModalDiagnostico: boolean = false;
  rol: string = '';

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.citasProgramadas.sort((a, b) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
    this.medicoService
      .obtenerEspecialidadPorIdMedico(this.authService.getUserId()!)
      .then((data) => {
        this.especialidad = data.especialidad ?? [];
      })
      .catch((error) => {});

    this.diasSemanaService
      .listarDiasSemana()
      .then((data) => {
        this.diasSemana = this.ordenarDiasSemana(data.diasSemana);
      })
      .catch((error) => {
        console.log(error);
      });

    this.rol = this.authService.getUserRole() ?? '';

    this.listarCitasAgendadas();
    this.listarDisponiblidadesDeCita();
  }

  agregarDisponibilidad() {
    if (this.nuevaDisponibilidad.dia && this.nuevaDisponibilidad.hora) {
      this.isLoading = true;
      this.medicoService
        .obtenerEspecialidadPorIdMedico(this.authService.getUserId()!)
        .then((especialidad) => {
          var diaIndex = this.diasSemana.findIndex(
            (d) => d.id == this.nuevaDisponibilidad.dia
          );
          var horaIndex = this.horas.findIndex(
            (d) => d == this.nuevaDisponibilidad.hora
          );

          var cita: RegistrarDisponibilidadCitaDTO = {
            idMedico: this.authService.getUserId()!,
            idDiaSemana: diaIndex + 1,
            idHora: horaIndex + 1,
            idEspecialidad: especialidad.especialidad.id,
          };

          this.citasService
            .registrarDisponibilidad(cita)
            .then((res) => {
              console.log(res);

              if (res.httpStatus == 200) {
                this.nuevaDisponibilidad.dia = 0;
                this.nuevaDisponibilidad.hora = '';
                this.listarDisponiblidadesDeCita();
                this.isLoading = false;
                showAlert('success', res.mensaje);
              } else {
                this.isLoading = false;
                showAlert('error', res.mensaje);
              }
            })
            .catch((error) => {
              this.isLoading = false;
              showAlert(
                'error',
                error?.error?.message || 'Error al registrar disponibilidad'
              );
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  ocultarDisponibilidad(idHora: number, idDia: number, disponible: boolean) {
    this.isLoading = true;
    const data: CambiarEstadoDisponibilidadDTO = {
      idMedico: this.authService.getUserId()!,
      idDiaSemana: idDia,
      idHora: idHora,
      activo: !disponible,
    };

    this.medicoService.cambiarEstadoCita(data).then((res) => {
      this.isLoading = false;
      this.listarDisponiblidadesDeCita();
      showAlert('success', res.mensaje);
    });
  }

  filtrarCitasPorDia() {
    if (this.filtroDia == 0) {
      this.citasFiltradas = this.citasProgramadas;
      return;
    }

    var diaIndex = this.diasSemana.findIndex((d) => d.id == this.filtroDia);

    this.citasFiltradas = this.citasProgramadas.filter((cita) => {
      let diaSemana = new Date(cita.fecha).getDay();
      return diaSemana == diaIndex;
    });
  }

  ordenarDiasSemana(
    dias: { id: number; dia: string }[]
  ): { id: number; dia: string }[] {
    const ordenCorrecto = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];

    return dias.sort((a, b) => {
      return ordenCorrecto.indexOf(a.dia) - ordenCorrecto.indexOf(b.dia);
    });
  }

  async cambiarVista(nuevaVista: 'citas' | 'agregar' | 'eliminar') {
    this.vista = nuevaVista;
    if (nuevaVista === 'citas') {
      this.listarCitasAgendadas();
    }
  }

  async listarCitasAgendadas() {
    this.citasService
      .listarCitasAgendadas(this.authService.getUserId()!)
      .then((dato) => {
        this.citasProgramadas = [];
        for (let i = 0; i < dato.citas.length; i++) {
          if (dato.citas[i].estado.toLocaleLowerCase() == 'reservado') {
            this.citasProgramadas.push(dato.citas[i]);
          }
        }
        this.filtrarCitasPorDia();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async listarDisponiblidadesDeCita() {
    this.medicoService
      .listarHorariosDeTrabajoPorMedico(this.authService.getUserId()!)
      .then((res) => {
        if (res.httpStatus == 200) {
          this.disponibilidades = res.datos;
        } else {
          showAlert('error', res.mensaje);
        }
      })
      .catch((error) => {
        console.log('Ocurrió un error en la consulta' + error);
      });
  }

  marcarcitaComoAtendido(idCita: number) {
    this.idCitaSeleccionada = idCita;
    this.mostrarModalDiagnostico = true;
  }

  confirmarAtencionCita() {
    if (this.diagnostico == '') {
      showAlert('error', 'El diagnóstico no puede estar vacío.');
      return;
    }

    if (this.medicamentos.length < 1) {
      showAlert('error', 'Debe proporcionar al menos un medicamento.');
      return;
    }

    const request = {
      diagnostico: this.diagnostico,
      medicamentos: this.medicamentos,
    };

    this.citasService
      .marcarcitaComoAtendido(this.idCitaSeleccionada, request)
      .then((res) => {
        if (res.httpStatus == 200) {
          this.listarCitasAgendadas();
          showAlert('success', res.mensaje);
          this.mostrarModalDiagnostico = false;
          this.resetFormulario();
        } else {
          showAlert('error', res.mensaje);
        }
      })
      .catch((error) => {
        console.log('Error al marcar la cita como atendida ' + error);
      });
  }

  agregarMedicamento() {
    this.medicamentos.push({ medicamento: '', indicaciones: '' });
  }

  eliminarMedicamento(index: number) {
    this.medicamentos.splice(index, 1);
  }

  resetFormulario() {
    this.diagnostico = '';
    this.medicamentos = [{ medicamento: '', indicaciones: '' }];
  }

  listarHistorialPaciente(idPaciente: number) {
    this.isLoading = true;
    console.log(`Listando historial del paciente con ID: ${idPaciente}`);

    this.pacienteService
      .verDetallesDeCitaAtendidaPorpaciente(idPaciente)
      .then((res) => {
        if (!res || !res.datos || res.datos.length === 0) {
          // console.log("No hay historial disponible.");
          this.historialPaciente = [];
          this.mostrarHistorial = true;
          return;
        }

        this.historialPaciente = res.datos.reverse() ?? [];
        this.isLoading = false;
        this.mostrarHistorial = true;
      })
      .catch((error) => {
        this.isLoading = false;
        console.log('Error al listar el historial del paciente ' + error);
      });
  }

  cerrarHistorial() {
    this.mostrarHistorial = false;
  }

  // componente.ts
  esCitaPasada(fecha: string, hora: string): boolean {
    const ahora = new Date();

    const fechaHoraCita = new Date(`${fecha}T${hora}:00`);

    return ahora >= fechaHoraCita;
  }

  obtenerDiaSemana(fecha: string) {
    return obtenerDiaSemana(fecha);
  }

  navigateVideoCall(usuarioId: number, roomId: string) {
    // this.router.navigate(['/videocall', usuarioId]);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/videocall', usuarioId, roomId])
    );
    window.open(url, '_blank');
  }
}
