import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RegistrarMedicoComponent } from '../../auth/registrar-medico/registrar-medico.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { MedicoService } from '../../services/medico.service';
import { MedicoDTO } from '../../DTO/medico.interface';
import { PacienteDTO } from '../../DTO/paciente.interface';
import { PacienteService } from '../../services/paciente.service';
import { UsuarioResponse } from '../../interface/Usuario/Usuario.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgClass, RegistrarMedicoComponent, RegisterComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  medicoService = inject(MedicoService)
  pacienteService = inject(PacienteService)
  authService = inject(AuthService);

  selectedGestion: 'medico' | 'paciente' | 'admin' = 'medico';
  selectedTab: string = 'registrar';

  tabs = {
    medico: [
      { key: 'registrar', label: 'Registrar médico' },
      { key: 'listar', label: 'Listar médicos' }
    ],
    paciente: [
      { key: 'registrar', label: 'Registrar paciente' },
      { key: 'listar', label: 'Listar pacientes' }
    ],
    admin: [
      { key: 'registrar', label: 'Registrar admin' },
      { key: 'listar', label: 'Listar admins' }
    ]
  };

  medicos: MedicoDTO[] = [];
  pacientes: PacienteDTO[] = [];
 usuario: UsuarioResponse = this.authService.getUsuarioStorage()!;

  ngOnInit(): void {
    this.listarMedicos();
    this.listarPacientes();
  }

  get currentTabs() {
    return this.tabs[this.selectedGestion];
  }

  selectGestion(gestion: 'medico' | 'paciente' | 'admin') {
    this.selectedGestion = gestion;
    this.selectedTab = 'registrar';

  }

  selectTab(tabKey: string) {
    this.selectedTab = tabKey;
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().then(data => {
      this.pacientes = data;
    }).catch((error) => {
      console.log("Error al listar los pacientes " + error);
    })
  }


  listarMedicos() {
    this.medicoService.listarMedicos().then(_medicos => {
      this.medicos = _medicos;
      console.log(this.medicos);
    }).catch((error) => {
      console.log("Error al listar los medicos " + error);
    })
  }
}
