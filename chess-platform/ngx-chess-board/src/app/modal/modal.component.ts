import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Output() closeModalEvent = new EventEmitter();
  @Output() NextPuzzlesEvent: EventEmitter<any> = new EventEmitter<any>();
  closeModal(): void {
    this.closeModalEvent.emit();
  }
  nextPuzzles(){
    this.NextPuzzlesEvent.emit();
  }
}
