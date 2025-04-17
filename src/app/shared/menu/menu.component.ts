import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  isAutentiticared: boolean = false;

  constructor(private router: Router) { }

  navegarAEspecialidades() {
    this.router.navigate(['/especialidades'])
  }

}
