import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-editar-usuario.component.html',
  styleUrl: './modal-editar-usuario.component.css'
})
export class ModalEditarUsuarioComponent {
  @Input() mostrarModal: boolean = false;
  @Input() formGroup!: FormGroup;
  @Input() titulo: string = '';
  @Input() campos: { name: string, label: string, type?: string, options?: any[] }[] = [];
  @Input() especialidades: any[] = [];
  @Output() guardar = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  onSubmit() {
    if (this.formGroup.valid) {
      this.guardar.emit();
    }
  }
  onClose() {
    this.cerrar.emit();
  }
}
