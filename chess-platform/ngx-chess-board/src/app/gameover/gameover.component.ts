import { Component, Output, EventEmitter } from '@angular/core';
 
@Component({
  selector: 'app-gameover',
  standalone: true,
  imports: [],
  templateUrl: './gameover.component.html',
  styleUrl: './gameover.component.scss'
})
export class GameoverComponent {
  @Output() closeModalEvent = new EventEmitter();
  @Output() NextPuzzlesEvent: EventEmitter<any> = new EventEmitter<any>();
  closeModal(): void {
    this.closeModalEvent.emit();
  }
  nextPuzzles(){
    this.NextPuzzlesEvent.emit();
  }
}
