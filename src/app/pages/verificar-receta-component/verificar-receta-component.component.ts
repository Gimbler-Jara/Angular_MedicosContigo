import { Component, inject } from '@angular/core';
import { DetalleCitaAtendidaDTO } from '../../DTO/DetalleCitaAtendida.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CitasService } from '../../services/citas.service';

@Component({
  selector: 'app-verificar-receta-component',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './verificar-receta-component.component.html',
  styleUrl: './verificar-receta-component.component.css'
})
export class VerificarRecetaComponentComponent {
  activedRouter = inject(ActivatedRoute)
  citaService = inject(CitasService)

  fechaActual: Date = new Date();
  detalleCita!: DetalleCitaAtendidaDTO;

  ngOnInit(): void {
    this.activedRouter.paramMap.subscribe(async (param) => {
      var idCita = param.get('id');
      this.citaService.verDetallesDeCitaAtendida(Number(idCita)).then((data) => {
        this.detalleCita = data;
      }).catch((error) => {
        console.error("Error al obtener los detalles:", error);
      });
    });
  }
}
