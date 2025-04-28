import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioResponse } from '../../interface/Usuario/Usuario.interface';
import { CitasAgendadasResponseDTO } from '../../DTO/CitasAgendada.response.interface';
import { CitasService } from '../../services/citas.service';
import { RegistrarDisponibilidadCitaDTO } from '../../DTO/RegistrarDisponibilidad.interface';
import { Especialidad } from '../../interface/Especialidad.interface';
import { DisponibilidadesResponse } from '../../DTO/DisponibilidadesCitasResponse.interface';
import { MedicoService } from '../../services/medico.service';
import { DisponibilidadCitaPorMedicoDTO } from '../../DTO/DisponibilidadCitaPorMedico.interface';
import { CambiarEstadoDisponibilidadDTO } from '../../DTO/CambiarEstadoDisponibilidad.interface';

@Component({
  selector: 'app-perfil-medico',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil-medico.component.html',
  styleUrl: './perfil-medico.component.css'
})
export class PerfilMedicoComponent {
  authService = inject(AuthService);
  citasService = inject(CitasService)
  medicoService = inject(MedicoService)
  vista: 'citas' | 'agregar' | 'eliminar' = 'citas';

  citasProgramadas: CitasAgendadasResponseDTO[] = [];
  citasFiltradas = [...this.citasProgramadas];

  disponibilidades: DisponibilidadCitaPorMedicoDTO[] = [];

  filtroDia = '';
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horas = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];

  nuevaDisponibilidad = { dia: '', hora: '' };

  usuario: UsuarioResponse = this.authService.getUsuarioStorage()!;

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.citasProgramadas.sort((a, b) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });

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

        console.log(cita);
        this.citasService.registrarDisponibilidad(cita)
          .then(res => {
            console.log("Respues " + res);

            if (res.success) {
              // Éxito: muestra el mensaje y limpia los campos
              console.log(res.message);
              this.nuevaDisponibilidad.dia = "";
              this.nuevaDisponibilidad.hora = "";
              this.listarDisponiblidadesDeCita();
            } else {
              // Error controlado por el backend (por ejemplo: "La disponibilidad ya existe")
              alert(res.message);
            }
          })
          .catch(error => {
            // Error de red o del servidor
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
    });
  }

  filtrarCitasPorDia() {
    if (!this.filtroDia) {
      this.citasFiltradas = this.citasProgramadas;
      return;
    }

    var diaIndex = this.diasSemana.findIndex(d => d == this.filtroDia);

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
      this.citasProgramadas = dato ?? [];
      console.log(this.citasProgramadas);
      this.filtrarCitasPorDia()
    }).catch(error => {
      console.log(error);
    });
  }

  async listarDisponiblidadesDeCita() {
    this.medicoService.listarPorMedico(this.usuario.id!).then(res => {
      if (res.success) {
        console.log(res.data);
        this.disponibilidades = res.data;
      } else {
        alert(res.message);
      }
    }).catch(error => {
      console.log("Ocurrió un error en la consulta" + error);

    })
  }
}
