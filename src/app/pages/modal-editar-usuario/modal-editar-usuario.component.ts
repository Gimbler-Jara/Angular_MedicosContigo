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
  @Input() modalTipo: 'paciente' | 'medico' = 'paciente';
  @Input() formGroup!: FormGroup;
  @Input() titulo: string = '';
  @Input() campos: { name: string, label: string, type?: string, options?: any[] }[] = [];
  @Input() especialidades: any[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<{ datos: any, archivo?: File }>();

  firmaDigital?: File;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.firmaDigital = file;
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.guardar.emit({
        datos: this.formGroup.value,
        archivo: this.firmaDigital
      });
    }
  }
  onClose() {
    this.cerrar.emit();
  }
}
