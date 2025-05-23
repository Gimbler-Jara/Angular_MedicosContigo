import { Component, inject } from '@angular/core';
import { DetalleCitaAtendida } from '../../DTO/DetalleCitaAtendida.DTO';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CitasService } from '../../services/citas.service';
import { MedicoService } from '../../services/medico.service';
import { MedicoDTO } from '../../DTO/medico.DTO';

@Component({
  selector: 'app-verificar-receta-component',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './verificar-receta-component.component.html',
  styleUrl: './verificar-receta-component.component.css'
})
export class VerificarRecetaComponentComponent {
  activedRouter = inject(ActivatedRoute);
  citaService = inject(CitasService);
  medicoService = inject(MedicoService);

  fechaActual: Date = new Date();
  detalleCita!: DetalleCitaAtendida;
  urlFirma: string = "";
  medico: MedicoDTO | undefined;

  ngOnInit(): void {
    this.activedRouter.paramMap.subscribe(async (param) => {
      var idCita = param.get('id');

      this.citaService.verDetallesDeCitaAtendida(Number(idCita)).then((res) => {

        this.detalleCita = res.datos;

        this.medicoService.obtenerMedico(res.datos.idMedico).then((res) => {
          console.log(res);
           this.medico = res.medico;
          this.medicoService.obtenerUrlFirmaDigital(res.medico.urlFirmaDigital).then((data) => {

            var dataSerializada = JSON.parse(data)
            this.urlFirma = dataSerializada.url;

          }).catch((error) => {
            console.log("Error al obtener la url: " + JSON.stringify(error));
          });

        }).catch(() => { });

      }).catch((error) => {
        console.error("Error al obtener los detalles:", error);
      });
    });
  }
}
