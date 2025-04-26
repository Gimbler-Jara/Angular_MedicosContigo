import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioResponse } from '../../interface/Usuario/Usuario.interface';
import { CitasAgendadasResponseDTO } from '../../DTO/CitasAgendada.response.interface';
import { CitasService } from '../../services/citas.service';
import { RegistrarDisponibilidadCitaDTO } from '../../DTO/RegistrarDisponibilidad.interface';
import { Especialidad } from '../../interface/Especialidad.interface';

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
  vista: 'citas' | 'agregar' | 'eliminar' = 'citas';

  citasProgramadas: CitasAgendadasResponseDTO[] = [];
  citasFiltradas = [...this.citasProgramadas];

  disponibilidades = [
    { dia: 'Lunes', hora: '08:00 AM' },
    { dia: 'Martes', hora: '10:00 AM' }
  ];

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  filtroDia = '';
  horas = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];

  nuevaDisponibilidad = { dia: '', hora: '' };

  usuario: UsuarioResponse = this.authService.getUsuarioStorage()!;

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.citasProgramadas.sort((a, b) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });

    this.listarCitasAgendadas();
  }

  agregarDisponibilidad() {
    if (this.nuevaDisponibilidad.dia && this.nuevaDisponibilidad.hora) {
      this.citasService.obtenerEspecialidadPorIdMedico(this.usuario.id!).then(e => {
        var diaIndex = this.diasSemana.findIndex(d => d == this.nuevaDisponibilidad.dia);
        var horaIndex = this.horas.findIndex(d => d == this.nuevaDisponibilidad.hora);

        var cita: RegistrarDisponibilidadCitaDTO = {
          idMedico: this.usuario.id!,
          idDiaSemana: diaIndex + 1,
          idHora: horaIndex + 1,
          idEspecialidad: e.id
        }

        console.log(cita);
        this.citasService.registrarDisponibilidad(cita).then(() => {
          console.log('Disponibilidad registrada exitosamente');
        })
          .catch(error => {
            console.error('Error al registrar disponibilidad:', error);
          });

      }).catch((error) => {
        console.log(error);
      });
    }
  }

  eliminarDisponibilidad(dispo: any) {
    this.disponibilidades = this.disponibilidades.filter(d => d !== dispo);
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
      this.citasProgramadas = dato;
      console.log(this.citasProgramadas);
      this.filtrarCitasPorDia()
    }).catch(error => {
      console.log(error);
    });
  }
}
