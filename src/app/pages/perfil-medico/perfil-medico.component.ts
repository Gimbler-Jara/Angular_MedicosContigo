import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioResponse } from '../../interface/Usuario/Usuario.interface';
import { CitasAgendadasResponseDTO } from '../../DTO/CitasAgendada.response.interface';
import { CitasService } from '../../services/citas.service';
import { RegistrarDisponibilidadCitaDTO } from '../../DTO/RegistrarDisponibilidad.interface';
import { MedicoService } from '../../services/medico.service';
import { DisponibilidadCitaPorMedicoDTO } from '../../DTO/DisponibilidadCitaPorMedico.interface';
import { CambiarEstadoDisponibilidadDTO } from '../../DTO/CambiarEstadoDisponibilidad.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Especialidad } from '../../interface/Especialidad.interface';
import { MedicamentoInputDTO } from '../../DTO/MedicamentoInput.interface';

@Component({
  selector: 'app-perfil-medico',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './perfil-medico.component.html',
  styleUrl: './perfil-medico.component.css'
})
export class PerfilMedicoComponent {
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  citasService = inject(CitasService)
  medicoService = inject(MedicoService)
  vista: 'citas' | 'agregar' | 'eliminar' = 'citas';

  citasProgramadas: CitasAgendadasResponseDTO[] = [];
  citasFiltradas = [...this.citasProgramadas];

  disponibilidades: DisponibilidadCitaPorMedicoDTO[] = [];

  filtroDia = '';
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horas = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  nuevaDisponibilidad = { dia: '', hora: '' };
  especialidad: Especialidad = { id: 0, especialidad: '' };
  usuario: UsuarioResponse = this.localStorageService.getUsuarioStorage()!;

  diagnostico: string = '';
  medicamentos: MedicamentoInputDTO[] = [
    { medicamento: '', indicaciones: '' }
  ];

  idCitaSeleccionada: number = 0;
  mostrarModalDiagnostico: boolean = false;

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.citasProgramadas.sort((a, b) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
    this.medicoService.obtenerEspecialidadPorIdMedico(this.usuario.id!).then(e => {
      this.especialidad = e;
    }).catch((error) => { });

    this.listarCitasAgendadas();
    this.listarDisponiblidadesDeCita();
  }

  agregarDisponibilidad() {
    if (this.nuevaDisponibilidad.dia && this.nuevaDisponibilidad.hora) {
      this.medicoService.obtenerEspecialidadPorIdMedico(this.usuario.id!).then(e => {
        var diaIndex = this.diasSemana.findIndex(d => d == this.nuevaDisponibilidad.dia);
        var horaIndex = this.horas.findIndex(d => d == this.nuevaDisponibilidad.hora);

        var cita: RegistrarDisponibilidadCitaDTO = {
          idMedico: this.usuario.id!,
          idDiaSemana: diaIndex + 1,
          idHora: horaIndex + 1,
          idEspecialidad: e.id
        }

        this.citasService.registrarDisponibilidad(cita)
          .then(res => {

            if (res.success) {
              this.nuevaDisponibilidad.dia = "";
              this.nuevaDisponibilidad.hora = "";
              this.listarDisponiblidadesDeCita();
              this.showAlert('success', res.message);
            } else {
              this.showAlert('error', res.message);
            }
          })
          .catch(error => {
            this.showAlert('error', error?.error?.message || 'Error al registrar disponibilidad');
            alert(error?.error?.message || 'Error al registrar disponibilidad');
          });
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  ocultarDisponibilidad(idHora: number, idDia: number, disponible: boolean) {
    const data: CambiarEstadoDisponibilidadDTO = {
      idMedico: this.usuario.id!,
      idDiaSemana: idDia,
      idHora: idHora,
      activo: !disponible
    };

    this.medicoService.cambiarEstadoCita(data).then(() => {
      this.listarDisponiblidadesDeCita();
      this.showAlert('success', 'Disponibilidad actualizada correctamente');
    });
  }

  filtrarCitasPorDia() {
    if (!this.filtroDia) {
      this.citasFiltradas = this.citasProgramadas;
      return;
    }

    var diaIndex = this.diasSemana.findIndex(d => d == this.filtroDia) + 1;

    this.citasFiltradas = this.citasProgramadas.filter(cita => {
      let diaSemana = new Date(cita.fecha).getDay();
      return diaSemana == diaIndex;
    });
  }

  async cambiarVista(nuevaVista: 'citas' | 'agregar' | 'eliminar') {
    this.vista = nuevaVista;
    if (nuevaVista === 'citas') {
      this.listarCitasAgendadas();
    }
  }

  async listarCitasAgendadas() {
    this.citasService.listarCitasAgendadas(this.usuario.id!).then(dato => {
      this.citasProgramadas = [];
      for (let i = 0; i < dato.length; i++) {

        if (dato[i].estado.toLocaleLowerCase() == "reservado") {
          this.citasProgramadas.push(dato[i]);
        }
      }
      this.filtrarCitasPorDia()
    }).catch(error => {
      console.log(error);
    });
  }

  async listarDisponiblidadesDeCita() {
    this.medicoService.listarHorariosDeTranajoPorMedico(this.usuario.id!).then(res => {
      if (res.success) {
        this.disponibilidades = res.data;
      } else {
        alert(res.message);
      }
    }).catch(error => {
      console.log("Ocurrió un error en la consulta" + error);
    })
  }

  marcarcitaComoAtendido(idCita: number) {
    //abrir modal para registrar el diagbostico y receta
    this.idCitaSeleccionada = idCita;
    this.mostrarModalDiagnostico = true;
  }

  confirmarAtencionCita() {
    const request = {
      diagnostico: this.diagnostico,
      medicamentos: this.medicamentos
    };

    this.citasService.marcarcitaComoAtendido(this.idCitaSeleccionada, request).then(() => {
      this.listarCitasAgendadas();
      this.showAlert('success', 'Cita marcada como atendida');
      this.mostrarModalDiagnostico = false;
      this.resetFormulario();
    }).catch(error => {
      console.log("Error al marcar la cita como atendida " + error);
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


  // componente.ts
  esCitaPasada(fecha: string, hora: string): boolean {
    const ahora = new Date();

    const fechaHoraCita = new Date(`${fecha}T${hora}:00`);

    return ahora >= fechaHoraCita;
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
