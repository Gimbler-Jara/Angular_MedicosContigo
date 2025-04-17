import { Component } from '@angular/core';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css'
})
export class EspecialidadesComponent {

  ngOnInit(): void {
    window.scrollTo(0, 0); 
  }
}
